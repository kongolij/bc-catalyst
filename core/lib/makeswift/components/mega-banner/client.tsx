'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

interface BannerItem {
  title?: string;
  description?: string;
  btnName?: string;
  btnLink?: { href: string; target?: string };
  imageSrc?: string;
}

interface BannerSection {
  fromApi?: boolean;
  isOwnDesign?: boolean;
  ownDesign?: ReactNode;
  hidePathName?: string;
  title?: string;
  bannerSection?: BannerItem[];
}

interface Props {
  megaBannerData?: {
    topBanner?: BannerSection;
    bottomBanner?: BannerSection;
  };
}

function TopBanner({ title, isOwnDesign, ownDesign }: BannerSection) {
  if (isOwnDesign && ownDesign) return <>{ownDesign}</>;

  return (
    <div className="w-full bg-[#1a2340] py-4 text-white">
      <div className="mx-auto max-w-screen-xl px-4">
        <p className="text-center text-sm font-medium md:text-base">{title}</p>
      </div>
    </div>
  );
}

function BottomBanner({ bannerSection = [], isOwnDesign, ownDesign }: BannerSection) {
  if (isOwnDesign && ownDesign) return <>{ownDesign}</>;

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="mx-auto grid max-w-screen-xl gap-6 px-4 md:grid-cols-2">
        {bannerSection.map((item, i) => (
          <div
            className="flex flex-col items-start gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            key={i}
          >
            {item.imageSrc && (
              <div className="relative h-32 w-full overflow-hidden rounded-md">
                <Image alt={item.title ?? ''} fill src={item.imageSrc} style={{ objectFit: 'cover' }} />
              </div>
            )}
            {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
            {item.btnName && item.btnLink?.href && (
              <Link
                className="rounded-[40px] border border-[#c8d32c] bg-[#c8d32c] px-6 py-2 text-sm font-medium transition-colors hover:bg-[#c8d32c]/80"
                href={item.btnLink.href}
                target={item.btnLink.target ?? '_self'}
              >
                {item.btnName}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MegaBanner({ megaBannerData }: Props) {
  const { topBanner, bottomBanner } = megaBannerData ?? {};

  return (
    <div className="w-full">
      {topBanner && <TopBanner {...topBanner} />}
      {bottomBanner && <BottomBanner {...bottomBanner} />}
    </div>
  );
}
