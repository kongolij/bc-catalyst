'use client';

import Link from 'next/link';

interface FooterLink {
  label?: string;
  link?: { href?: string; target?: string };
}

interface FooterSection {
  title?: string;
  links?: FooterLink[];
}

interface Props {
  className?: string;
  mode?: 'ges' | 'custom';
  logo?: {
    show?: boolean;
    image?: string;
    alt?: string;
    fallbackText?: string;
    href?: string;
    width?: number;
  };
  legalLinks?: FooterLink[];
  sections?: FooterSection[];
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
  };
}

const GES_LOGO = 'https://www.ges.com/wp-content/uploads/2024/07/ges-footer-logo.svg';
const GES_LEGAL_LINKS: FooterLink[] = [
  {
    label: 'Privacy Policy',
    link: { href: 'https://www.ges.com/legal/privacy-policy/', target: '_blank' },
  },
  {
    label: 'Terms of Use',
    link: { href: 'https://www.ges.com/legal/terms-and-conditions/', target: '_blank' },
  },
];

function EditableLink({ item, color, hoverColor }: { item: FooterLink; color: string; hoverColor: string }) {
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
      style={{ color }}
      target={item.link.target}
    >
      {item.label}
    </Link>
  );
}

export function GesShowFooterClient({
  className,
  mode = 'ges',
  logo = {},
  legalLinks,
  sections,
  copyright = {},
  contact = {},
  appearance = {},
}: Props) {
  const isGesPreset = mode === 'ges';
  const effectiveLegalLinks = legalLinks?.length ? legalLinks : isGesPreset ? GES_LEGAL_LINKS : [];
  const background = appearance.background || '#0a2536';
  const text = appearance.text || '#a8b8c3';
  const link = appearance.link || '#88c5cf';
  const linkHover = appearance.linkHover || '#a8b8c3';
  const accent = appearance.accent || '#c8d32c';
  const showLogo = logo.show ?? true;
  const logoImage = logo.image || (isGesPreset ? GES_LOGO : undefined);
  const showContact = contact.show ?? isGesPreset;
  const showCopyright = copyright.show ?? true;
  const includeCurrentYear = copyright.includeCurrentYear ?? true;
  const copyrightText = copyright.text?.trim() || (isGesPreset ? 'GES. All rights reserved.' : 'All rights reserved.');
  const additionalLabel = copyright.additionalLabel?.trim() || (isGesPreset ? 'Logistics Terms & Conditions' : '');
  const additionalHref = copyright.additionalLink?.href || (isGesPreset ? 'https://www.ges.com/legal/logistics-terms-and-conditions/' : '');
  const contactLabel = contact.label?.trim() || (isGesPreset ? 'Contact' : 'Contact us');
  const contactHref = contact.link?.href || '#';

  return (
    <footer className={className} style={{ backgroundColor: background, color: text }}>
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-10 px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {showLogo && (
            <Link aria-label="Home" className="flex min-w-[182px] items-center justify-center md:justify-start" href={logo.href || '/'}>
              {logoImage ? (
                <img alt={logo.alt || 'GES'} src={logoImage} style={{ height: 'auto', maxWidth: logo.width || 182 }} />
              ) : (
                <strong className="text-2xl text-white">{logo.fallbackText || 'Logo'}</strong>
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
                      <EditableLink color={link} hoverColor={linkHover} item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {showCopyright && (
              <p className="text-sm md:text-base">
                {includeCurrentYear && `© ${new Date().getFullYear()} `}
                {copyrightText}{' '}
                {additionalLabel && additionalHref && (
                  <Link
                    href={additionalHref}
                    rel={copyright.additionalLink?.target === '_blank' || isGesPreset ? 'noopener noreferrer' : undefined}
                    target={copyright.additionalLink?.target || (isGesPreset ? '_blank' : undefined)}
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

        {(sections ?? []).length > 0 && (
          <div className="grid grid-cols-1 gap-8 border-t border-white/20 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {sections?.map((section, sectionIndex) => (
              <section key={`${section.title}-${sectionIndex}`}>
                {section.title?.trim() && <h2 className="mb-3 font-semibold text-white">{section.title}</h2>}
                <ul className="space-y-2">
                  {(section.links ?? []).map((item, linkIndex) => (
                    <li key={`${item.label}-${linkIndex}`}>
                      <EditableLink color={link} hoverColor={linkHover} item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
