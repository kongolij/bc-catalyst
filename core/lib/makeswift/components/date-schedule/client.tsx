'use client';

import Image from 'next/image';
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

interface Props {
  dateScheduleData?: {
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
    contentData?: {
      fromApi?: boolean;
      title?: string;
      messageData?: ReactNode;
    };
    importantDatesDeadlineData?: {
      fromApi?: boolean;
      importantDatesList?: ImportantDate[];
    };
  };
}

function formatDate(isoDate?: string) {
  if (!isoDate) return '';
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

export function DateScheduleClient({ dateScheduleData }: Props) {
  const { bannerData, breadcrumbsData, contentData, importantDatesDeadlineData } =
    dateScheduleData ?? {};

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

      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-4 py-8">
        {/* Content / Message */}
        {contentData && (
          <section>
            {contentData.title && (
              <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">{contentData.title}</h2>
            )}
            {contentData.messageData}
          </section>
        )}

        {/* Date Schedule Table */}
        {(importantDatesDeadlineData?.importantDatesList ?? []).length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">Date Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#1a2340] text-white">
                    <th className="px-4 py-3 text-left">Start Date</th>
                    <th className="px-4 py-3 text-left">End Date</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {importantDatesDeadlineData!.importantDatesList!.filter((d) => d.showInList !== false).map((date, i) => (
                    <tr className="border-b border-gray-200 even:bg-gray-50" key={i}>
                      <td className="px-4 py-3">{formatDate(date.startDate)}</td>
                      <td className="px-4 py-3">{formatDate(date.endDate)}</td>
                      <td className="px-4 py-3">{date.scheduleType}</td>
                      <td className="px-4 py-3">{date.scheduleNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!contentData?.messageData && !importantDatesDeadlineData?.importantDatesList?.length && (
          <div className="py-8 text-center text-gray-400">
            Add content in the CMS
          </div>
        )}
      </div>
    </div>
  );
}
