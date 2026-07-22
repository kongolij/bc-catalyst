'use client';

import Link from 'next/link';

interface Panel {
  background?: string;
  textColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonBg?: string;
  buttonText?: string;
}

interface Props {
  className?: string;
  panels?: Panel[];
}

export function GesSplitBannerClient({ className, panels }: Props) {
  const items = panels ?? [];

  if (items.length === 0) return null;

  const cls = ['ges-split-banner', className].filter(Boolean).join(' ');

  return (
    <div className={cls} data-count={items.length}>
      {items.map((p, i) => {
        const panelStyle = {
          background: p.background ?? '#c8d629',
          color: p.textColor ?? '#0a2540',
        };
        const btnStyle = {
          background: p.buttonBg ?? '#0a2540',
          color: p.buttonText ?? '#ffffff',
        };

        return (
          <div key={i} className="ges-split-banner__panel" style={panelStyle}>
            {p.imageUrl ? (
              <div className="ges-split-banner__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt={p.imageAlt ?? ''} />
              </div>
            ) : null}

            <div className="ges-split-banner__content">
              {p.title ? <h3 className="ges-split-banner__title">{p.title}</h3> : null}
              {p.body ? <p className="ges-split-banner__body">{p.body}</p> : null}

              {p.buttonLabel ? (
                p.buttonHref ? (
                  <Link
                    className="ges-split-banner__button"
                    href={p.buttonHref}
                    style={btnStyle}
                  >
                    {p.buttonLabel}
                  </Link>
                ) : (
                  <span className="ges-split-banner__button" style={btnStyle}>
                    {p.buttonLabel}
                  </span>
                )
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
