'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Props {
  breadcrumbs?: BreadcrumbItem[];
}

export function GESBreadcrumbs({ breadcrumbs = [] }: Props) {
  if (breadcrumbs.length === 0) {
    return (
      <nav aria-label="breadcrumb" className="p-2 text-sm text-gray-400">
        Add breadcrumbs in the CMS
      </nav>
    );
  }

  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 py-2 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            {isLast ? (
              <span className="font-medium text-gray-700">{crumb.label}</span>
            ) : (
              <>
                <Link className="text-[#E06A26] hover:underline" href={crumb.href}>
                  {crumb.label}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
