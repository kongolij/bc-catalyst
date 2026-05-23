'use client';

import Link from 'next/link';

import { GESBreadcrumbs } from '../breadcrumbs/client';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ExhibitorItem {
  title?: string;
  description?: string;
  linkLabel?: string;
  link?: { href: string; target?: string };
}

interface ExhibitorData {
  fromApi?: boolean;
  title?: string;
  exhibitorList?: ExhibitorItem[];
}

interface MoveInDateData {
  fromApi?: boolean;
  title?: string;
  moveInDate?: string[];
}

interface MoveInNoteItem {
  title?: string;
  titleLink?: { href: string };
  content?: string;
}

interface MoveInNotesData {
  fromApi?: boolean;
  title?: string;
  moveInNotesList?: MoveInNoteItem[];
}

interface MoveOutNoticeData {
  fromApi?: boolean;
  description?: string;
  linkLabel?: string;
  link?: { href: string };
}

interface Props {
  moveInObjectData?: {
    titleData?: { fromApi?: boolean; title?: string };
    breadcrumbsData?: { fromApi?: boolean; breadcrumbsList?: BreadcrumbItem[] };
    exhibitorData?: ExhibitorData;
    keyDatesAndTimesData?: {
      titleData?: { fromApi?: boolean; title?: string };
      moveInDateData?: MoveInDateData;
      moveInNotesData?: MoveInNotesData;
      moveOutNoticeData?: MoveOutNoticeData;
    };
    successCentralData?: ExhibitorData;
  };
}

function ExhibitorSection({ title, exhibitorList = [] }: ExhibitorData) {
  return (
    <section className="mb-8">
      {title && <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">{title}</h2>}
      <div className="flex flex-col gap-4">
        {exhibitorList.map((item, i) => (
          <div className="rounded-lg border border-gray-200 p-4" key={i}>
            {item.title && <h3 className="mb-1 font-semibold">{item.title}</h3>}
            {item.description && (
              <p className="text-sm text-gray-600">
                {item.description.split('||').map((part, pi) =>
                  pi % 2 === 0 ? (
                    part
                  ) : item.link?.href ? (
                    <Link
                      className="text-[#E06A26] underline"
                      href={item.link.href}
                      key={pi}
                      target={item.link.target}
                    >
                      {item.linkLabel || part}
                    </Link>
                  ) : (
                    <span className="text-[#E06A26]" key={pi}>
                      {item.linkLabel || part}
                    </span>
                  ),
                )}
              </p>
            )}
          </div>
        ))}
        {exhibitorList.length === 0 && (
          <div className="py-4 text-sm text-gray-400">Add items in the CMS</div>
        )}
      </div>
    </section>
  );
}

export function MoveInClient({ moveInObjectData }: Props) {
  const { titleData, breadcrumbsData, exhibitorData, keyDatesAndTimesData, successCentralData } =
    moveInObjectData ?? {};

  const { titleData: keyTitle, moveInDateData, moveInNotesData, moveOutNoticeData } =
    keyDatesAndTimesData ?? {};

  return (
    <div className="w-full">
      {breadcrumbsData?.breadcrumbsList && (
        <GESBreadcrumbs breadcrumbs={breadcrumbsData.breadcrumbsList} />
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-8">
        {titleData?.title && (
          <h1 className="mb-8 text-2xl font-bold md:text-3xl">{titleData.title}</h1>
        )}

        {/* Exhibitor Data */}
        {exhibitorData && <ExhibitorSection {...exhibitorData} />}

        {/* Key Dates & Times */}
        {keyDatesAndTimesData && (
          <section className="mb-8">
            {keyTitle?.title && (
              <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">{keyTitle.title}</h2>
            )}

            {/* Move-In Dates */}
            {moveInDateData && (
              <div className="mb-6 rounded-lg border border-gray-200 p-4">
                {moveInDateData.title && <h3 className="mb-2 font-semibold">{moveInDateData.title}</h3>}
                <ul className="list-disc pl-5 text-sm">
                  {(moveInDateData.moveInDate ?? []).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Move-In Notes */}
            {moveInNotesData && (
              <div className="mb-6">
                {moveInNotesData.title && (
                  <h3 className="mb-3 font-semibold uppercase">{moveInNotesData.title}</h3>
                )}
                <div className="flex flex-col gap-4">
                  {(moveInNotesData.moveInNotesList ?? []).map((note, i) => (
                    <div className="rounded-lg border border-gray-200 p-4" key={i}>
                      {note.title && (
                        <h4 className="mb-1 font-medium">
                          {note.titleLink?.href ? (
                            <Link className="text-[#E06A26] hover:underline" href={note.titleLink.href}>
                              {note.title}
                            </Link>
                          ) : (
                            note.title
                          )}
                        </h4>
                      )}
                      {note.content && <p className="text-sm text-gray-600">{note.content}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Move-Out Notice */}
            {moveOutNoticeData && moveOutNoticeData.description && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm">
                  {moveOutNoticeData.description.split('||').map((part, pi) =>
                    pi % 2 === 0 ? (
                      part
                    ) : moveOutNoticeData.link?.href ? (
                      <Link
                        className="text-[#E06A26] underline"
                        href={moveOutNoticeData.link.href}
                        key={pi}
                      >
                        {moveOutNoticeData.linkLabel || part}
                      </Link>
                    ) : (
                      <span className="text-[#E06A26]" key={pi}>
                        {moveOutNoticeData.linkLabel || part}
                      </span>
                    ),
                  )}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Success Central */}
        {successCentralData && <ExhibitorSection {...successCentralData} />}
      </div>
    </div>
  );
}
