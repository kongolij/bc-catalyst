'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
} from 'react';

type NavLink = {
  label: string;
  href: string;
  target?: string;
  groups?: Array<{
    label: string;
    href?: string;
    links?: Array<{ label: string; href: string }>;
  }>;
};

type LogoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
} | null;

type ContextProps = {
  logo: LogoProps;
  links: NavLink[];
};

const PropsContext = createContext<ContextProps>({ logo: null, links: [] });

export function PropsContextProvider({
  value,
  children,
}: PropsWithChildren<{ value: ContextProps }>) {
  return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
}

interface MakeswiftNavLink {
  label: string;
  href?: { href: string; target?: string };
  groups?: Array<{
    label: string;
    isLink?: boolean;
    href?: { href: string };
    links?: Array<{ label: string; href?: { href: string } }>;
  }>;
}

interface MakeswiftSiteLogo {
  fromApi?: boolean;
  isLink?: boolean;
  link?: { href: string };
  desktop?: {
    isIcon?: string;
    alt?: string;
    src?: string;
    width?: string;
    height?: string;
  };
}

interface Props {
  siteLogo?: MakeswiftSiteLogo;
  megaMenuData?: MakeswiftNavLink[];
  headerRightSide?: {
    isLocale?: boolean;
    isAccount?: boolean;
    isBooth?: boolean;
    isContactUs?: boolean;
    isCart?: boolean;
    isSearch?: boolean;
  };
}

export function MakeswiftHeader({ siteLogo, megaMenuData }: Props) {
  const passedProps = useContext(PropsContext);

  const logo: LogoProps =
    siteLogo?.desktop?.src
      ? {
          src: siteLogo.desktop.src,
          alt: siteLogo.desktop.alt ?? 'Logo',
          width: Number(siteLogo.desktop.width) || 200,
          height: Number(siteLogo.desktop.height) || 40,
        }
      : passedProps.logo;

  const links: NavLink[] = megaMenuData?.length
    ? megaMenuData.map((item) => ({
        label: item.label,
        href: item.href?.href ?? '#',
        target: item.href?.target,
        groups: item.groups?.map((g) => ({
          label: g.label,
          href: g.href?.href,
          links: g.links?.map((l) => ({ label: l.label, href: l.href?.href ?? '#' })),
        })),
      }))
    : passedProps.links;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 @container @xl:px-6 @4xl:px-8">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={logo.alt}
            height={logo.height}
            src={logo.src}
            style={{ maxHeight: logo.height, maxWidth: logo.width }}
            width={logo.width}
          />
        )}

        <nav className="hidden items-center gap-6 @lg:flex">
          {links.map((link) => (
            <a
              className="text-sm font-medium hover:underline"
              href={link.href}
              key={link.label}
              target={link.target}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
