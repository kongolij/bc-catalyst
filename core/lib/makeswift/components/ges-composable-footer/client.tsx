'use client';

import { Link } from '~/components/link';

type Placement = 'left' | 'center' | 'right';

interface FooterLink {
  label?: string;
  link?: { href?: string; target?: string };
}

interface NavigationSection {
  title?: string;
  placement?: Placement;
  order?: number;
  links?: FooterLink[];
}

interface Props {
  className?: string;
  logo?: {
    show?: boolean;
    image?: string;
    alt?: string;
    fallbackText?: string;
    href?: string;
    width?: number;
  };
  navigationSections?: NavigationSection[];
  legalLinks?: FooterLink[];
  copyright?: {
    show?: boolean;
    text?: string;
    includeCurrentYear?: boolean;
    additionalLabel?: string;
    additionalLink?: { href?: string; target?: string };
  };
  contact?: {
    show?: boolean;
    label?: string;
    link?: { href?: string; target?: string };
  };
  appearance?: {
    background?: string;
    text?: string;
    link?: string;
    linkHover?: string;
    accent?: string;
    sectionTitle?: string;
    divider?: string;
  };
}

const GES_LOGO = 'https://www.ges.com/wp-content/uploads/2024/07/ges-footer-logo.svg';

const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', link: { href: 'https://www.ges.com/legal/privacy-policy/', target: '_blank' } },
  { label: 'Terms of Use', link: { href: 'https://www.ges.com/legal/terms-and-conditions/', target: '_blank' } },
];

const DEFAULT_COPYRIGHT_TEXT = 'GES. All rights reserved.';
const DEFAULT_ADDITIONAL_LABEL = 'Logistics Terms & Conditions';
const DEFAULT_ADDITIONAL_HREF = 'https://www.ges.com/legal/logistics-terms-and-conditions/';
const DEFAULT_CONTACT_LABEL = 'Contact';

function EditableLink({
  item,
  color,
  hoverColor,
}: {
  item: FooterLink;
  color: string;
  hoverColor: string;
}) {
  if (!item.label?.trim() || !item.link?.href) return null;

  return (
    <Link
      href={item.link.href}
      onMouseEnter={(event) => {
        event.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.color = color;
      }}
      rel={item.link.target === '_blank' ? 'noopener noreferrer' : undefined}
      style={{ color, transition: 'color 120ms ease' }}
      target={item.link.target}
    >
      {item.label}
    </Link>
  );
}

function regionize(sections: NavigationSection[] | undefined) {
  const by = (placement: Placement) =>
    (sections ?? [])
      .map((section, index) => ({ section, index }))
      .filter(({ section }) => (section.placement ?? 'left') === placement)
      .sort((left, right) => {
        const leftOrder = left.section.order && left.section.order > 0 ? left.section.order : 10_000 + left.index;
        const rightOrder = right.section.order && right.section.order > 0 ? right.section.order : 10_000 + right.index;
        return leftOrder - rightOrder;
      })
      .map(({ section }) => section);

  return { left: by('left'), center: by('center'), right: by('right') };
}

function Section({
  section,
  linkColor,
  linkHover,
  titleColor,
}: {
  section: NavigationSection;
  linkColor: string;
  linkHover: string;
  titleColor: string;
}) {
  const visibleLinks = (section.links ?? []).filter((item) => item.label?.trim() && item.link?.href);
  if (!section.title?.trim() && visibleLinks.length === 0) return null;

  return (
    <section>
      {section.title?.trim() && (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: titleColor }}>
          {section.title}
        </h2>
      )}
      {visibleLinks.length > 0 && (
        <ul className="space-y-2 text-sm">
          {visibleLinks.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <EditableLink color={linkColor} hoverColor={linkHover} item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Region({
  sections,
  align,
  linkColor,
  linkHover,
  titleColor,
}: {
  sections: NavigationSection[];
  align: 'items-start' | 'items-center' | 'items-end';
  linkColor: string;
  linkHover: string;
  titleColor: string;
}) {
  if (sections.length === 0) return <div aria-hidden />;

  return (
    <div className={`flex flex-col gap-8 ${align}`}>
      {sections.map((section, index) => (
        <Section
          key={`${section.title}-${index}`}
          linkColor={linkColor}
          linkHover={linkHover}
          section={section}
          titleColor={titleColor}
        />
      ))}
    </div>
  );
}

// The component intentionally coordinates independently editable footer regions.
// eslint-disable-next-line complexity
export function GesComposableFooterClient({
  className,
  logo = {},
  navigationSections,
  legalLinks,
  copyright = {},
  contact = {},
  appearance = {},
}: Props) {
  const background = appearance.background || '#0a2536';
  const text = appearance.text || '#a8b8c3';
  const linkColor = appearance.link || '#88c5cf';
  const linkHover = appearance.linkHover || '#ffffff';
  const accent = appearance.accent || '#c8d32c';
  const sectionTitle = appearance.sectionTitle || '#ffffff';
  const divider = appearance.divider || 'rgba(255,255,255,0.2)';

  const showLogo = logo.show ?? true;
  const logoImage = logo.image || GES_LOGO;
  const showContact = contact.show ?? true;
  const showCopyright = copyright.show ?? true;
  const includeCurrentYear = copyright.includeCurrentYear ?? true;
  const copyrightText = copyright.text?.trim() || DEFAULT_COPYRIGHT_TEXT;
  const additionalLabel = copyright.additionalLabel?.trim() || DEFAULT_ADDITIONAL_LABEL;
  const additionalHref = copyright.additionalLink?.href || DEFAULT_ADDITIONAL_HREF;
  const additionalTarget = copyright.additionalLink?.target || '_blank';
  const contactLabel = contact.label?.trim() || DEFAULT_CONTACT_LABEL;
  const contactHref = contact.link?.href || '#';

  const effectiveLegalLinks = legalLinks?.length ? legalLinks : DEFAULT_LEGAL_LINKS;
  const regions = regionize(navigationSections);
  const hasNavRow = regions.left.length + regions.center.length + regions.right.length > 0;

  return (
    <footer className={className} style={{ backgroundColor: background, color: text }}>
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-10 px-4 py-12">
        {hasNavRow && (
          <div
            className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-3"
            style={{ borderBottom: `1px solid ${divider}` }}
          >
            <Region
              align="items-start"
              linkColor={linkColor}
              linkHover={linkHover}
              sections={regions.left}
              titleColor={sectionTitle}
            />
            <Region
              align="items-center"
              linkColor={linkColor}
              linkHover={linkHover}
              sections={regions.center}
              titleColor={sectionTitle}
            />
            <Region
              align="items-end"
              linkColor={linkColor}
              linkHover={linkHover}
              sections={regions.right}
              titleColor={sectionTitle}
            />
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {showLogo && (
            <Link
              aria-label="Home"
              className="flex min-w-[182px] items-center justify-center md:justify-start"
              href={logo.href || '/'}
            >
              {logoImage ? (
                // Makeswift image URLs and the external GES preset logo are runtime-configurable.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={logo.alt || 'GES'}
                  src={logoImage}
                  style={{ height: 'auto', maxWidth: logo.width || 182 }}
                />
              ) : (
                <strong className="text-2xl text-white">{logo.fallbackText || 'GES'}</strong>
              )}
            </Link>
          )}

          <div className="flex flex-1 flex-col items-center gap-3 text-center">
            {effectiveLegalLinks.length > 0 && (
              <nav aria-label="Legal links">
                <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                  {effectiveLegalLinks.map((item, index) => (
                    <li className="flex items-center gap-3" key={`${item.label}-${index}`}>
                      {index > 0 && <span aria-hidden>|</span>}
                      <EditableLink color={linkColor} hoverColor={linkHover} item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {showCopyright && (
              <p className="text-sm md:text-base">
                {includeCurrentYear && `© ${new Date().getFullYear()} `}
                {copyrightText}{' '}
                {additionalLabel !== '' && additionalHref !== '' && (
                  <Link
                    href={additionalHref}
                    rel={additionalTarget === '_blank' ? 'noopener noreferrer' : undefined}
                    style={{ color: linkColor }}
                    target={additionalTarget}
                  >
                    {additionalLabel}
                  </Link>
                )}
              </p>
            )}
          </div>

          {showContact && (
            <Link
              className="inline-flex min-w-[130px] items-center justify-center rounded-full border-2 px-6 py-3 font-medium transition-colors"
              href={contactHref}
              rel={contact.link?.target === '_blank' ? 'noopener noreferrer' : undefined}
              style={{ backgroundColor: accent, borderColor: accent, color: '#000000' }}
              target={contact.link?.target}
            >
              {contactLabel}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
