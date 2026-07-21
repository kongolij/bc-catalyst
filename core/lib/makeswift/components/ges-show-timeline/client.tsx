'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ManualLabel {
  text?: string;
}

interface ManualEvent {
  day?: string;
  month?: string;
  labels?: ManualLabel[];
}

interface ApiEvent {
  day: string;
  month: string;
  labels: string[];
}

type Mode = 'auto' | 'manual';

interface Props {
  className?: string;
  title?: string;
  viewLinkLabel?: string;
  viewLinkUrl?: string;
  mode?: Mode;
  events?: ManualEvent[];
}

export function GesShowTimelineClient({
  className,
  title = 'Show Timeline',
  viewLinkLabel = 'View Full Schedule',
  viewLinkUrl,
  mode = 'auto',
  events,
}: Props) {
  const [apiEvents, setApiEvents] = useState<ApiEvent[]>([]);

  useEffect(() => {
    if (mode !== 'auto') return;

    let cancelled = false;

    fetch('/api/ges/show-timeline')
      .then((r) => r.json())
      .then((data: { events?: ApiEvent[] }) => {
        if (!cancelled) setApiEvents(data.events ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiEvents([]);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const items: ApiEvent[] =
    mode === 'manual'
      ? (events ?? []).map((e) => ({
          day: e.day ?? '',
          month: e.month ?? '',
          labels: (e.labels ?? []).map((l) => l.text ?? '').filter(Boolean),
        }))
      : apiEvents;

  return (
    <section className={['ges-timeline', className].filter(Boolean).join(' ')}>
      {title && <h2 className="ges-timeline__title">{title}</h2>}

      {viewLinkUrl && viewLinkLabel && (
        <Link className="ges-timeline__link" href={viewLinkUrl}>
          {viewLinkLabel}
        </Link>
      )}

      {items.length > 0 && (
        <div className="ges-timeline__track">
          <div className="ges-timeline__line" />
          <div className="ges-timeline__stops">
            {items.map((ev, i) => (
              <div key={i} className="ges-timeline__stop">
                <div className="ges-timeline__dot" />
                <div className="ges-timeline__card">
                  <div className="ges-timeline__day">{ev.day}</div>
                  <div className="ges-timeline__month">{ev.month}</div>
                </div>
                <ul className="ges-timeline__labels">
                  {ev.labels.map((lbl, j) => (
                    <li key={j}>{lbl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
