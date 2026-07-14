'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';

import { FeaturedProductCarousel } from '@/vibes/soul/sections/featured-product-carousel';
import { FeaturedProductList } from '@/vibes/soul/sections/featured-product-list';
import { Subscribe } from '~/components/subscribe';

import { Slideshow } from '~/app/[locale]/(default)/_components/slideshow';
import { useMakeswiftHomePageData } from './data-context';

interface Props {
  top?: ReactNode;
  afterHero?: ReactNode;
  middle?: ReactNode;
  belowNewest?: ReactNode;
  bottom?: ReactNode;
}

export function MakeswiftHomePage({
  top,
  afterHero,
  middle,
  belowNewest,
  bottom,
}: Props) {
  const t = useTranslations('Home');
  const { featuredProducts, newestProducts } = useMakeswiftHomePageData();

  return (
    <div
      style={{
        left: '50%',
        minWidth: 0,
        position: 'relative',
        transform: 'translateX(-50%)',
        width: '100vw',
      }}
    >
      {top}

      <Slideshow />

      {afterHero}

      <FeaturedProductList
        cta={{ label: t('FeaturedProducts.cta'), href: '/shop-all' }}
        description={t('FeaturedProducts.description')}
        emptyStateSubtitle={t('FeaturedProducts.emptyStateSubtitle')}
        emptyStateTitle={t('FeaturedProducts.emptyStateTitle')}
        products={featuredProducts}
        title={t('FeaturedProducts.title')}
      />

      {middle}

      <FeaturedProductCarousel
        cta={{ label: t('NewestProducts.cta'), href: '/shop-all/?sort=newest' }}
        description={t('NewestProducts.description')}
        emptyStateSubtitle={t('NewestProducts.emptyStateSubtitle')}
        emptyStateTitle={t('NewestProducts.emptyStateTitle')}
        nextLabel={t('NewestProducts.nextProducts')}
        previousLabel={t('NewestProducts.previousProducts')}
        products={newestProducts}
        title={t('NewestProducts.title')}
      />

      {belowNewest}

      <Subscribe />

      {bottom}
    </div>
  );
}
