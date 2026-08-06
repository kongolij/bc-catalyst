import { getFormatter, getTranslations } from 'next-intl/server';
import { createLoader, SearchParams } from 'nuqs/server';
import { cache } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { ProductsListSection } from '@/vibes/soul/sections/products-list-section';
import { getFilterParsers } from '@/vibes/soul/sections/products-list-section/filter-parsers';
import { getSessionCustomerAccessToken } from '~/auth';
import { facetsTransformer } from '~/data-transformers/facets-transformer';
import { pageInfoTransformer } from '~/data-transformers/page-info-transformer';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { MAX_COMPARE_LIMIT } from '~/app/[locale]/(default)/compare/page-data';
import { getCompareProducts as getCompareProductsData } from '~/app/[locale]/(default)/(faceted)/fetch-compare-products';
import { fetchFacetedSearch } from '~/app/[locale]/(default)/(faceted)/fetch-faceted-search';
import { getSearchPageData } from '~/app/[locale]/(default)/(faceted)/search/page-data';

import type { CatalystProductListingContextValue } from './context';

interface BuildOptions {
  searchParams: Promise<SearchParams>;
}

const compareLoader = createCompareLoader();

const createSearchSearchParamsLoader = cache(
  async (searchParams: SearchParams, customerAccessToken?: string) => {
    const searchTerm = typeof searchParams.term === 'string' ? searchParams.term : '';

    if (!searchTerm) return null;

    const search = await fetchFacetedSearch(searchParams, undefined, customerAccessToken);
    const searchFacets = search.facets.items;
    const transformedSearchFacets = await facetsTransformer({
      refinedFacets: searchFacets,
      allFacets: searchFacets,
      searchParams: {},
    });
    const searchFilters = transformedSearchFacets.filter((facet) => facet != null);
    const filterParsers = getFilterParsers(searchFilters);

    if (Object.keys(filterParsers).length === 0) return null;

    return createLoader(filterParsers);
  },
);

export async function buildSearchProductListingContextValue({
  searchParams,
}: BuildOptions): Promise<CatalystProductListingContextValue | null> {
  const t = await getTranslations('Faceted');
  const { settings } = await getSearchPageData();

  const productComparisonsEnabled =
    settings?.storefront.catalog?.productComparisonsEnabled ?? false;

  const streamableFacetedSearch = Streamable.from(async () => {
    const params = await searchParams;
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();

    const loadSearchParams = await createSearchSearchParamsLoader(params, customerAccessToken);
    const parsedSearchParams = loadSearchParams?.(params) ?? {};

    return await fetchFacetedSearch(
      { ...params, ...parsedSearchParams },
      currencyCode,
      customerAccessToken,
    );
  });

  const streamableProducts = Streamable.from(async () => {
    const format = await getFormatter();
    const params = await searchParams;
    const searchTerm = typeof params.term === 'string' ? params.term : '';

    if (!searchTerm) return [];

    const search = await streamableFacetedSearch;

    return search.products.items.map((product) => ({
      id: product.entityId.toString(),
      title: product.name,
      href: product.path,
      image: product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
      price: pricesTransformer(product.prices, format),
      subtitle: product.brand?.name ?? undefined,
    }));
  });

  const streamableTitle = Streamable.from(async () => {
    const params = await searchParams;
    const searchTerm = typeof params.term === 'string' ? params.term : '';

    return `${t('Search.searchResults')} "${searchTerm}"`;
  });

  const streamableTotalCount = Streamable.from(async () => {
    const format = await getFormatter();
    const params = await searchParams;
    const searchTerm = typeof params.term === 'string' ? params.term : '';

    if (!searchTerm) return format.number(0);

    const search = await streamableFacetedSearch;

    return format.number(search.products.collectionInfo?.totalItems ?? 0);
  });

  const streamableEmptyStateTitle = Streamable.from(async () => {
    const params = await searchParams;
    const searchTerm = typeof params.term === 'string' ? params.term : '';

    return t('Search.Empty.title', { term: searchTerm });
  });

  const streamablePagination = Streamable.from(async () => {
    const params = await searchParams;
    const searchTerm = typeof params.term === 'string' ? params.term : '';

    if (!searchTerm) {
      return {
        startCursorParamName: 'before',
        endCursorParamName: 'after',
        endCursor: null,
        startCursor: null,
      };
    }

    const search = await streamableFacetedSearch;

    return pageInfoTransformer(search.products.pageInfo);
  });

  const streamableFilters = Streamable.from(async () => {
    const params = await searchParams;
    const searchTerm = typeof params.term === 'string' ? params.term : '';
    const customerAccessToken = await getSessionCustomerAccessToken();

    if (!searchTerm) return [];

    const loadSearchParams = await createSearchSearchParamsLoader(params, customerAccessToken);
    const parsedSearchParams = loadSearchParams?.(params) ?? {};
    const categorySearch = await fetchFacetedSearch({}, undefined, customerAccessToken);
    const refinedSearch = await streamableFacetedSearch;

    const allFacets = categorySearch.facets.items.filter(
      (facet) => facet.__typename !== 'CategorySearchFilter',
    );
    const refinedFacets = refinedSearch.facets.items.filter(
      (facet) => facet.__typename !== 'CategorySearchFilter',
    );

    const transformedFacets = await facetsTransformer({
      refinedFacets,
      allFacets,
      searchParams: { ...params, ...parsedSearchParams },
    });

    return transformedFacets.filter((facet) => facet != null);
  });

  const streamableCompareProducts = Streamable.from(async () => {
    const params = await searchParams;
    const customerAccessToken = await getSessionCustomerAccessToken();

    if (!productComparisonsEnabled) return [];

    const { compare } = compareLoader(params);
    const compareIds = { entityIds: compare ? compare.map((id: string) => Number(id)) : [] };
    const products = await getCompareProductsData(compareIds, customerAccessToken);

    return products.map((product) => ({
      id: product.entityId.toString(),
      title: product.name,
      image: product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
      href: product.path,
    }));
  });

  const productListing = (
    <ProductsListSection
      breadcrumbs={[
        { label: t('Search.Breadcrumbs.home'), href: '/' },
        { label: t('Search.Breadcrumbs.search'), href: `#` },
      ]}
      compareLabel={t('Compare.compare')}
      compareProducts={streamableCompareProducts}
      emptyStateSubtitle={t('Search.Empty.subtitle')}
      emptyStateTitle={streamableEmptyStateTitle}
      filterLabel={t('FacetedSearch.filters')}
      filters={streamableFilters}
      filtersPanelTitle={t('FacetedSearch.filters')}
      maxCompareLimitMessage={t('Compare.maxCompareLimit')}
      maxItems={MAX_COMPARE_LIMIT}
      paginationInfo={streamablePagination}
      products={streamableProducts}
      rangeFilterApplyLabel={t('FacetedSearch.Range.apply')}
      removeLabel={t('Compare.remove')}
      resetFiltersLabel={t('FacetedSearch.resetFilters')}
      showCompare={productComparisonsEnabled}
      sortDefaultValue="featured"
      sortLabel={t('SortBy.sortBy')}
      sortOptions={[
        { value: 'featured', label: t('SortBy.featuredItems') },
        { value: 'newest', label: t('SortBy.newestItems') },
        { value: 'best_selling', label: t('SortBy.bestSellingItems') },
        { value: 'a_to_z', label: t('SortBy.aToZ') },
        { value: 'z_to_a', label: t('SortBy.zToA') },
        { value: 'best_reviewed', label: t('SortBy.byReview') },
        { value: 'lowest_price', label: t('SortBy.priceAscending') },
        { value: 'highest_price', label: t('SortBy.priceDescending') },
        { value: 'relevance', label: t('SortBy.relevance') },
      ]}
      sortParamName="sort"
      title={streamableTitle}
      totalCount={streamableTotalCount}
    />
  );

  return { productListing };
}
