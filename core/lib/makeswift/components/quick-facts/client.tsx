'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { GESBreadcrumbs } from '../breadcrumbs/client';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ImportantDate {
  startDate?: string;
  endDate?: string;
  scheduleType?: string;
  scheduleNotes?: string;
  includeInCalender?: boolean;
  showInList?: boolean;
}

interface ShipmentBlock {
  title?: string;
  content?: string[];
}

interface SummaryItem {
  summaryItem?: string;
  summaryLinkLabel?: string;
  summaryLink?: { href: string; target?: string };
}

interface ShippingAddress {
  shipmentBlock?: ShipmentBlock[];
  arrayListStyle?: string[];
  summary?: SummaryItem[];
}

interface DescriptionListItem {
  label?: string;
  listLabel?: string[];
}

interface Props {
  quickFactsData?: {
    bannerData?: {
      fromApi?: boolean;
      title?: string;
      description?: string;
      showBannerLogo?: boolean;
      bannerLogo?: { url: string; dimensions?: { width: number; height: number } };
    };
    breadcrumbsData?: {
      fromApi?: boolean;
      breadcrumbsList?: BreadcrumbItem[];
    };
    whatsIncludedData?: {
      fromApi?: boolean;
      title?: string;
      messageData?: ReactNode;
    };
    importantDatesDeadlineData?: {
      fromApi?: boolean;
      title?: string;
      descriptionTitle?: string;
      description?: string;
      importantDatesList?: ImportantDate[];
    };
    shippingWarehouseData?: {
      fromApi?: boolean;
      title?: string;
      generateLabelName?: string;
      generateLabelLink?: { href: string };
      shippingAddress?: ShippingAddress[];
    };
    logisticsSectionData?: {
      fromApi?: boolean;
      title?: string;
      subtitle?: string;
      descriptionList?: DescriptionListItem[];
      domesticQuote?: { name?: string; link?: { href: string } };
      internationalQuote?: { name?: string; link?: { href: string } };
    };
  };
}

function formatDate(isoDate?: string) {
  if (!isoDate) return '';
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">{title}</h2>;
}

export function QuickFactsClient({ quickFactsData }: Props) {
  const {
    bannerData,
    breadcrumbsData,
    whatsIncludedData,
    importantDatesDeadlineData,
    shippingWarehouseData,
    logisticsSectionData,
  } = quickFactsData ?? {};

  return (
    <div className="w-full">
      {breadcrumbsData?.breadcrumbsList && (
        <GESBreadcrumbs breadcrumbs={breadcrumbsData.breadcrumbsList} />
      )}

      {/* Banner */}
      {(bannerData?.title || bannerData?.description) && (
        <div className="w-full bg-[#1a2340] py-8 text-white">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                {bannerData.title && (
                  <h1 className="text-2xl font-bold md:text-3xl">{bannerData.title}</h1>
                )}
                {bannerData.description && (
                  <p className="text-gray-300">{bannerData.description}</p>
                )}
              </div>
              {bannerData.showBannerLogo && bannerData.bannerLogo?.url && (
                <Image
                  alt="Show logo"
                  height={bannerData.bannerLogo.dimensions?.height ?? 80}
                  src={bannerData.bannerLogo.url}
                  width={bannerData.bannerLogo.dimensions?.width ?? 160}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-4 py-8">
        {/* What's Included */}
        {whatsIncludedData && (
          <section>
            {whatsIncludedData.title && <SectionTitle title={whatsIncludedData.title} />}
            {whatsIncludedData.messageData}
          </section>
        )}

        {/* Important Dates */}
        {importantDatesDeadlineData && (
          <section>
            {importantDatesDeadlineData.title && (
              <SectionTitle title={importantDatesDeadlineData.title} />
            )}
            {importantDatesDeadlineData.descriptionTitle && (
              <p className="mb-2 text-sm font-medium">{importantDatesDeadlineData.descriptionTitle}</p>
            )}
            {importantDatesDeadlineData.description && (
              <p className="mb-4 text-sm text-gray-600">{importantDatesDeadlineData.description}</p>
            )}
            {(importantDatesDeadlineData.importantDatesList ?? []).filter((d) => d.showInList).length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importantDatesDeadlineData.importantDatesList
                      ?.filter((d) => d.showInList)
                      .map((date, i) => (
                        <tr className="even:bg-gray-50" key={i}>
                          <td className="border border-gray-200 px-4 py-2">
                            {formatDate(date.startDate)}
                            {date.endDate && date.endDate !== date.startDate &&
                              ` – ${formatDate(date.endDate)}`}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">{date.scheduleType}</td>
                          <td className="border border-gray-200 px-4 py-2">{date.scheduleNotes}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Shipping & Warehouse */}
        {shippingWarehouseData && (
          <section>
            {shippingWarehouseData.title && <SectionTitle title={shippingWarehouseData.title} />}
            {shippingWarehouseData.generateLabelName && shippingWarehouseData.generateLabelLink?.href && (
              <Link
                className="mb-4 inline-block rounded border border-[#E06A26] px-4 py-2 text-sm text-[#E06A26] hover:bg-[#E06A26] hover:text-white"
                href={shippingWarehouseData.generateLabelLink.href}
              >
                {shippingWarehouseData.generateLabelName}
              </Link>
            )}
            {(shippingWarehouseData.shippingAddress ?? []).map((addr, i) => (
              <div className="mb-6" key={i}>
                {(addr.shipmentBlock ?? []).map((block, bi) => (
                  <div className="mb-4" key={bi}>
                    {block.title && <h3 className="mb-2 font-semibold">{block.title}</h3>}
                    <ul className="space-y-1 text-sm">
                      {(block.content ?? []).map((line, li) => (
                        <li key={li}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {(addr.arrayListStyle ?? []).length > 0 && (
                  <ul className="list-disc pl-5 text-sm">
                    {addr.arrayListStyle!.map((item, li) => (
                      <li key={li}>{item}</li>
                    ))}
                  </ul>
                )}
                {(addr.summary ?? []).map((s, si) => (
                  <p className="mt-2 text-sm" key={si}>
                    {s.summaryItem?.split('||').map((part, pi) =>
                      pi % 2 === 0 ? (
                        part
                      ) : s.summaryLink?.href ? (
                        <Link className="text-[#E06A26] underline" href={s.summaryLink.href} key={pi}>
                          {s.summaryLinkLabel || part}
                        </Link>
                      ) : (
                        <span className="text-[#E06A26]" key={pi}>
                          {s.summaryLinkLabel || part}
                        </span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Logistics */}
        {logisticsSectionData && (
          <section>
            {logisticsSectionData.title && <SectionTitle title={logisticsSectionData.title} />}
            {logisticsSectionData.subtitle && (
              <p className="mb-4 font-medium">{logisticsSectionData.subtitle}</p>
            )}
            <div className="mb-4 flex flex-col gap-4">
              {(logisticsSectionData.descriptionList ?? []).map((desc, i) => (
                <div key={i}>
                  {desc.label && <p className="text-sm">{desc.label}</p>}
                  {(desc.listLabel ?? []).length > 0 && (
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {desc.listLabel!.map((item, li) => <li key={li}>{item}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {logisticsSectionData.domesticQuote?.name && logisticsSectionData.domesticQuote.link?.href && (
                <Link
                  className="rounded border border-[#E06A26] px-4 py-2 text-sm text-[#E06A26] hover:bg-[#E06A26] hover:text-white"
                  href={logisticsSectionData.domesticQuote.link.href}
                >
                  {logisticsSectionData.domesticQuote.name}
                </Link>
              )}
              {logisticsSectionData.internationalQuote?.name && logisticsSectionData.internationalQuote.link?.href && (
                <Link
                  className="rounded border border-[#E06A26] px-4 py-2 text-sm text-[#E06A26] hover:bg-[#E06A26] hover:text-white"
                  href={logisticsSectionData.internationalQuote.link.href}
                >
                  {logisticsSectionData.internationalQuote.name}
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
