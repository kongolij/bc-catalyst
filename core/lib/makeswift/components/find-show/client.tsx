'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Event {
  name?: string;
  location?: string;
  date?: string;
}

interface Props {
  events?: Event[];
}

const ITEMS_PER_PAGE = 10;

export function FindShow({ events = [] }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.date?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-7 xl:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-center sm:text-left">
              Type show name, nickname, date, location, or acronym to begin.
            </label>
            <div className="relative">
              <input
                className="w-full rounded-[40px] border-2 border-black p-[11px_25px] pr-[50px] outline-none placeholder:font-semibold"
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Show text search"
                type="text"
                value={search}
              />
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#e06a26]"
                height={24}
                width={24}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <div>
            {paginated.length === 0 && (
              <div className="py-8 text-center text-gray-400">No events found</div>
            )}
            {paginated.map((event, index) => (
              <div
                className="flex flex-col items-start justify-between gap-5 border-b border-b-[#b2b2b2] py-5 text-base sm:flex-row"
                key={index}
              >
                <div className="flex flex-col gap-1">
                  <div className="cursor-pointer text-xl font-semibold transition-all duration-300 hover:text-[#e06a26]">
                    {event.name}
                  </div>
                  {event.location && <div>{event.location}</div>}
                  {event.date && <div>{event.date}</div>}
                </div>
                <div className="self-center sm:self-start">
                  <button className="flex items-center justify-center rounded-[40px] border border-[#c8d32c] bg-[#c8d32c] p-[11px_25px] text-base font-medium transition-all duration-300 hover:bg-[#c8d32c]/80">
                    Visit Site
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-end justify-end">
              <div className="flex flex-row rounded-[3px] border border-[#dddddd] [&>div]:cursor-pointer [&>div]:border-r [&>div]:border-r-[#dddddd] [&>div]:p-[6px_12px] [&>div:last-child]:border-none">
                <div onClick={() => setPage((p) => Math.max(1, p - 1))}>{'<'}</div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <div
                    className={p === page ? 'bg-[#c8d32c] text-white' : ''}
                    key={p}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </div>
                ))}
                <div onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>{'>'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
