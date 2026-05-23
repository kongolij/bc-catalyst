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

interface MoveOutDateItem {
  moveOutDatesList?: string[];
}

interface MoveOutNotesItem {
  title?: string;
  moveOutNotesList?: MoveOutDateItem[];
}

interface MoveOutTimesItem {
  title?: string;
  moveOutNotesList?: MoveOutNotesItem[];
}

interface MoveOutNoteItem {
  boldTitle?: string;
  title?: string;
  boldContent?: string;
  content?: string;
}

interface Props {
  moveOutObjectData?: {
    titleData?: { fromApi?: boolean; title?: string };
    breadcrumbsData?: { fromApi?: boolean; breadcrumbsList?: BreadcrumbItem[] };
    exhibitorData?: ExhibitorData;
    keyDatesAndTimesData?: {
      moveOutTimesData?: {
        fromApi?: boolean;
        moveOutTimesList?: MoveOutTimesItem[];
      };
      moveOutNotesData?: {
        fromApi?: boolean;
        title?: string;
        moveOutNotesList?: MoveOutNoteItem[];
        moveInNoticeData?: {
          fromApi?: boolean;
          title?: string;
          description?: string;
          linkLabel?: string;
          link?: { href: string };
        };
      };
      moveInNoticeData?: {
        fromApi?: boolean;
        description?: string;
        linkLabel?: string;
        link?: { href: string };
      };
    };
    successCentralData?: ExhibitorData;
    summaryData?: {
      fromApi?: boolean;
      summaryList?: string[];
    };
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
                    <span className="text-[#E06A26]" key={pi}>{item.linkLabel || part}</span>
                  ),
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderBoldTemplate(template?: string, boldValue?: string) {
  if (!template || !boldValue) return template;
  return template.split('|b|').map((part, i) =>
    i % 2 === 0 ? part : <strong key={i}>{boldValue}</strong>,
  );
}

export function MoveOutClient({ moveOutObjectData }: Props) {
  const { titleData, breadcrumbsData, exhibitorData, keyDatesAndTimesData, successCentralData, summaryData } =
    moveOutObjectData ?? {};

  const { moveOutTimesData, moveOutNotesData, moveInNoticeData } = keyDatesAndTimesData ?? {};

  return (
    <div className="w-full">
      {breadcrumbsData?.breadcrumbsList && (
        <GESBreadcrumbs breadcrumbs={breadcrumbsData.breadcrumbsList} />
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-8">
        {titleData?.title && (
          <h1 className="mb-8 text-2xl font-bold md:text-3xl">{titleData.title}</h1>
        )}

        {exhibitorData && <ExhibitorSection {...exhibitorData} />}

        {/* Move-Out Times */}
        {moveOutTimesData && (moveOutTimesData.moveOutTimesList ?? []).length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">Move-Out Times</h2>
            {moveOutTimesData.moveOutTimesList!.map((timeItem, ti) => (
              <div className="mb-4 rounded-lg border border-gray-200 p-4" key={ti}>
                {timeItem.title && <h3 className="mb-2 font-semibold">{timeItem.title}</h3>}
                {(timeItem.moveOutNotesList ?? []).map((notes, ni) => (
                  <div className="mb-2" key={ni}>
                    {notes.title && <p className="text-sm font-medium">{notes.title}</p>}
                    {(notes.moveOutNotesList ?? []).length > 0 && (
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {notes.moveOutNotesList!.map((dates, di) =>
                          (dates.moveOutDatesList ?? []).map((d, i) => (
                            <li key={`${di}-${i}`}>{d}</li>
                          )),
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Move-Out Notes */}
        {moveOutNotesData && (
          <section className="mb-8">
            {moveOutNotesData.title && (
              <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">
                {moveOutNotesData.title}
              </h2>
            )}
            <div className="flex flex-col gap-4">
              {(moveOutNotesData.moveOutNotesList ?? []).map((note, i) => (
                <div className="rounded-lg border border-gray-200 p-4" key={i}>
                  {note.title && (
                    <h3 className="mb-1 font-semibold">
                      {renderBoldTemplate(note.title, note.boldTitle)}
                    </h3>
                  )}
                  {note.content && (
                    <p className="text-sm text-gray-600">
                      {renderBoldTemplate(note.content, note.boldContent)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {moveOutNotesData.moveInNoticeData && moveOutNotesData.moveInNoticeData.description && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
                {moveOutNotesData.moveInNoticeData.title && (
                  <h3 className="mb-2 font-semibold">{moveOutNotesData.moveInNoticeData.title}</h3>
                )}
                <p className="text-sm">
                  {moveOutNotesData.moveInNoticeData.description.split('||').map((part, pi) =>
                    pi % 2 === 0 ? (
                      part
                    ) : moveOutNotesData.moveInNoticeData?.link?.href ? (
                      <Link
                        className="text-[#E06A26] underline"
                        href={moveOutNotesData.moveInNoticeData.link.href}
                        key={pi}
                      >
                        {moveOutNotesData.moveInNoticeData?.linkLabel || part}
                      </Link>
                    ) : (
                      <span className="text-[#E06A26]" key={pi}>
                        {moveOutNotesData.moveInNoticeData?.linkLabel || part}
                      </span>
                    ),
                  )}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Move-In Notice */}
        {moveInNoticeData?.description && (
          <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm">
              {moveInNoticeData.description.split('||').map((part, pi) =>
                pi % 2 === 0 ? (
                  part
                ) : moveInNoticeData.link?.href ? (
                  <Link
                    className="text-[#E06A26] underline"
                    href={moveInNoticeData.link.href}
                    key={pi}
                  >
                    {moveInNoticeData.linkLabel || part}
                  </Link>
                ) : (
                  <span className="text-[#E06A26]" key={pi}>
                    {moveInNoticeData.linkLabel || part}
                  </span>
                ),
              )}
            </p>
          </div>
        )}

        {successCentralData && <ExhibitorSection {...successCentralData} />}

        {/* Summary */}
        {summaryData && (summaryData.summaryList ?? []).length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">Summary</h2>
            <ul className="list-disc pl-5 text-sm">
              {summaryData.summaryList!.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
