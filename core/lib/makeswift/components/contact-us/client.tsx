'use client';

import { type ReactNode } from 'react';

import { GESBreadcrumbs } from '../breadcrumbs/client';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface SlotSection {
  fromApi?: boolean;
  hideContent?: boolean;
}

interface Props {
  contactUsData?: {
    contactUsTitleData?: { fromApi?: boolean; title?: string };
    breadcrumbsData?: { fromApi?: boolean; breadcrumbsList?: BreadcrumbItem[] };
    toolTipData?: SlotSection & { toolTipContent?: ReactNode };
    callUsData?: SlotSection & { callUsContent?: ReactNode };
    chatOnlineData?: SlotSection & { chatOnlineContent?: ReactNode };
    addressData?: SlotSection & { addressContent?: ReactNode };
  };
}

export function ContactUsClient({ contactUsData }: Props) {
  const { contactUsTitleData, breadcrumbsData, toolTipData, callUsData, chatOnlineData, addressData } =
    contactUsData ?? {};

  return (
    <div className="w-full">
      {breadcrumbsData?.breadcrumbsList && (
        <GESBreadcrumbs breadcrumbs={breadcrumbsData.breadcrumbsList} />
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-8">
        {contactUsTitleData?.title && (
          <h1 className="mb-8 text-2xl font-bold md:text-3xl">{contactUsTitleData.title}</h1>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!toolTipData?.hideContent && toolTipData?.toolTipContent && (
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              {toolTipData.toolTipContent}
            </div>
          )}

          {!callUsData?.hideContent && callUsData?.callUsContent && (
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              {callUsData.callUsContent}
            </div>
          )}

          {!chatOnlineData?.hideContent && chatOnlineData?.chatOnlineContent && (
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              {chatOnlineData.chatOnlineContent}
            </div>
          )}

          {!addressData?.hideContent && addressData?.addressContent && (
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              {addressData.addressContent}
            </div>
          )}
        </div>

        {!toolTipData?.toolTipContent &&
          !callUsData?.callUsContent &&
          !chatOnlineData?.chatOnlineContent &&
          !addressData?.addressContent && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {['Tooltip', 'Call Us', 'Chat Online', 'Address'].map((label) => (
                <div
                  className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400"
                  key={label}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
