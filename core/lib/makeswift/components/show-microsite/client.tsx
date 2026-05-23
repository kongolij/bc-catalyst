'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

interface ProgressItem {
  timeLineCounter?: boolean;
  title?: string;
  date?: string;
}

interface ProductItem {
  productName?: string;
  startDate?: string;
  endDate?: string;
  productImage?: string;
  prodIcon?: string;
  isLink?: boolean;
  href?: { href: string; target?: string };
}

interface ShippingItem {
  title?: string;
  href?: { href: string; target?: string };
  isLink?: boolean;
}

interface ResourceDesItem {
  title?: string;
  href?: { href: string; target?: string };
  isLink?: boolean;
}

interface ResourceItem {
  title?: string;
  href?: { href: string; target?: string };
  isLink?: boolean;
  resourceInformationDesList?: ResourceDesItem[];
}

interface NeedHelpItem {
  title?: string;
  icon?: 'msg' | 'call';
  href?: { href: string; target?: string };
  isLink?: boolean;
}

interface DateItem {
  showInList?: boolean;
  includeInCalender?: boolean;
  timeLineCounter?: boolean;
  date?: string;
  endDate?: string;
  description?: string;
}

interface DescriptionItem {
  data?: string;
}

interface Props {
  showMicroSiteData?: {
    welcomeMessageData?: { fromApi?: boolean; messageData?: ReactNode };
    bannerData?: {
      fromApi?: boolean;
      title?: string;
      description?: string;
      showBannerLogo?: boolean;
      bannerLogo?: { url: string; dimensions?: { width: number; height: number } };
    };
    progressBarData?: {
      fromApi?: boolean;
      title?: string;
      description?: string;
      progressBarList?: ProgressItem[];
    };
    productsAndServicesData?: {
      fromApi?: boolean;
      title?: string;
      productList?: ProductItem[];
    };
    shippingAndMaterialHandlingData?: {
      fromApi?: boolean;
      title?: string;
      description?: string;
      shippingMaterialList?: ShippingItem[];
    };
    resourcesAndInformationData?: {
      fromApi?: boolean;
      title?: string;
      resourceInformationList?: ResourceItem[];
    };
    actionItemsData?: {
      fromApi?: boolean;
      title?: string;
    };
    importantDatesData?: {
      fromApi?: boolean;
      title?: string;
      dateNumber?: string;
      dateUntil?: string;
      dateList?: DateItem[];
    };
    needHelpData?: {
      fromApi?: boolean;
      title?: string;
      descriptionList?: DescriptionItem[];
      needHelpList?: NeedHelpItem[];
    };
  };
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="mb-4 text-xl font-bold">{title}</h2>;
}

function PhoneIcon() {
  return (
    <svg fill="none" height={20} stroke="currentColor" viewBox="0 0 24 24" width={20}>
      <path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg fill="none" height={20} stroke="currentColor" viewBox="0 0 24 24" width={20}>
      <path
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

export function ShowMicroSiteClient({ showMicroSiteData }: Props) {
  const {
    welcomeMessageData,
    bannerData,
    progressBarData,
    productsAndServicesData,
    shippingAndMaterialHandlingData,
    resourcesAndInformationData,
    actionItemsData,
    importantDatesData,
    needHelpData,
  } = showMicroSiteData ?? {};

  return (
    <div className="w-full">
      {/* Welcome Message */}
      {welcomeMessageData?.messageData && (
        <div className="w-full py-6">
          <div className="mx-auto max-w-screen-xl px-4">{welcomeMessageData.messageData}</div>
        </div>
      )}

      {/* Banner */}
      {(bannerData?.title || bannerData?.description) && (
        <div className="w-full bg-[#1a2340] py-8 text-white">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                {bannerData.title && (
                  <h1 className="text-2xl font-bold md:text-3xl">{bannerData.title}</h1>
                )}
                {bannerData.description && (
                  <p className="mt-1 text-gray-300">{bannerData.description}</p>
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

      <div className="mx-auto flex max-w-screen-xl flex-col gap-12 px-4 py-8">
        {/* Progress Bar / Timeline */}
        {progressBarData && (progressBarData.progressBarList ?? []).length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              {progressBarData.title && <SectionTitle title={progressBarData.title} />}
              {progressBarData.description && (
                <span className="text-sm text-[#E06A26]">{progressBarData.description}</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200" />
              <div className="relative flex justify-between gap-4 overflow-x-auto pb-4">
                {progressBarData.progressBarList!.map((item, i) => (
                  <div className="flex min-w-[100px] flex-col items-center gap-2" key={i}>
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2340] text-xs text-white">
                      {i + 1}
                    </div>
                    <p className="text-center text-xs font-medium">{item.title}</p>
                    {item.date && (
                      <p className="text-center text-xs text-gray-500">
                        {(() => {
                          try {
                            return new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            });
                          } catch {
                            return item.date;
                          }
                        })()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products & Services */}
        {productsAndServicesData && (
          <section>
            {productsAndServicesData.title && (
              <SectionTitle title={productsAndServicesData.title} />
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {(productsAndServicesData.productList ?? []).map((product, i) => {
                const card = (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 p-4 text-center hover:shadow-md">
                    {product.productImage && (
                      <div className="relative h-16 w-16">
                        <Image
                          alt={product.productName ?? ''}
                          fill
                          src={product.productImage}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium">{product.productName}</span>
                  </div>
                );

                return product.isLink && product.href?.href ? (
                  <Link href={product.href.href} key={i} target={product.href.target ?? '_self'}>
                    {card}
                  </Link>
                ) : (
                  <div key={i}>{card}</div>
                );
              })}
            </div>
          </section>
        )}

        {/* Shipping & Material Handling */}
        {shippingAndMaterialHandlingData && (
          <section>
            {shippingAndMaterialHandlingData.title && (
              <SectionTitle title={shippingAndMaterialHandlingData.title} />
            )}
            {shippingAndMaterialHandlingData.description && (
              <p className="mb-4 text-gray-600">{shippingAndMaterialHandlingData.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {(shippingAndMaterialHandlingData.shippingMaterialList ?? []).map((item, i) =>
                item.isLink && item.href?.href ? (
                  <Link
                    className="rounded-[40px] border border-[#E06A26] px-5 py-2 text-sm text-[#E06A26] hover:bg-[#E06A26] hover:text-white"
                    href={item.href.href}
                    key={i}
                    target={item.href.target ?? '_self'}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span
                    className="rounded-[40px] border border-gray-300 px-5 py-2 text-sm"
                    key={i}
                  >
                    {item.title}
                  </span>
                ),
              )}
            </div>
          </section>
        )}

        {/* Resources & Information */}
        {resourcesAndInformationData && (
          <section>
            {resourcesAndInformationData.title && (
              <SectionTitle title={resourcesAndInformationData.title} />
            )}
            <div className="flex flex-col gap-4">
              {(resourcesAndInformationData.resourceInformationList ?? []).map((resource, i) => (
                <div className="rounded-lg border border-gray-200 p-4" key={i}>
                  {resource.isLink && resource.href?.href ? (
                    <Link className="font-medium text-[#E06A26] hover:underline" href={resource.href.href}>
                      {resource.title}
                    </Link>
                  ) : (
                    <h3 className="font-medium">{resource.title}</h3>
                  )}
                  {(resource.resourceInformationDesList ?? []).length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1">
                      {resource.resourceInformationDesList!.map((des, di) =>
                        des.isLink && des.href?.href ? (
                          <li key={di}>
                            <Link
                              className="text-sm text-[#E06A26] hover:underline"
                              href={des.href.href}
                              target={des.href.target ?? '_self'}
                            >
                              {des.title}
                            </Link>
                          </li>
                        ) : (
                          <li className="text-sm text-gray-600" key={di}>
                            {des.title}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Items */}
        {actionItemsData?.title && (
          <section>
            <SectionTitle title={actionItemsData.title} />
            <div className="rounded-lg border border-gray-200 p-6 text-sm text-gray-500">
              Action items are loaded from the API when available.
            </div>
          </section>
        )}

        {/* Important Dates */}
        {importantDatesData && (
          <section>
            {importantDatesData.title && <SectionTitle title={importantDatesData.title} />}
            {(importantDatesData.dateNumber || importantDatesData.dateUntil) && (
              <div className="mb-4 flex items-center gap-2">
                {importantDatesData.dateNumber && (
                  <span className="text-3xl font-bold text-[#E06A26]">
                    {importantDatesData.dateNumber}
                  </span>
                )}
                {importantDatesData.dateUntil && (
                  <span className="text-sm text-gray-600">{importantDatesData.dateUntil}</span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3">
              {(importantDatesData.dateList ?? [])
                .filter((d) => d.showInList !== false)
                .map((date, i) => (
                  <div
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    key={i}
                  >
                    <span className="text-sm font-medium">{date.description}</span>
                    <span className="text-sm text-gray-500">{date.date}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Need Help */}
        {needHelpData && (
          <section className="rounded-lg bg-gray-50 p-6">
            {needHelpData.title && <SectionTitle title={needHelpData.title} />}
            {(needHelpData.descriptionList ?? []).map((desc, i) => (
              <p className="mb-1 text-sm text-gray-600" key={i}>{desc.data}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-4">
              {(needHelpData.needHelpList ?? []).map((item, i) =>
                item.isLink && item.href?.href ? (
                  <Link
                    className="flex items-center gap-2 rounded-[40px] border border-[#1a2340] px-5 py-2 text-sm font-medium text-[#1a2340] hover:bg-[#1a2340] hover:text-white"
                    href={item.href.href}
                    key={i}
                    target={item.href.target ?? '_self'}
                  >
                    {item.icon === 'msg' ? <MessageIcon /> : <PhoneIcon />}
                    {item.title}
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-2 rounded-[40px] border border-gray-300 px-5 py-2 text-sm"
                    key={i}
                  >
                    {item.icon === 'msg' ? <MessageIcon /> : <PhoneIcon />}
                    {item.title}
                  </span>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
