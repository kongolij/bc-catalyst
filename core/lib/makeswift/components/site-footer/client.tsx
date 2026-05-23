'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
} from 'react';

import { Footer, type FooterProps, type Section } from '@/vibes/soul/sections/footer';
import { mergeSections } from '~/lib/makeswift/utils/merge-sections';

type ResolvedFooterProps = Omit<FooterProps, 'logo' | 'sections' | 'copyright'> & {
  logo: string | { src: string; alt: string };
  sections: Section[];
  copyright?: string;
};

const PropsContext = createContext<ResolvedFooterProps>({
  logo: '',
  sections: [],
});

export function PropsContextProvider({
  value,
  children,
}: PropsWithChildren<{ value: ResolvedFooterProps }>) {
  return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
}

interface MakeswiftLogoProps {
  show: boolean;
  src?: string;
  alt: string;
  width: number;
  height: number;
}

interface MakeswiftSectionProps {
  title: string;
  links: Array<{
    label: string;
    link: { href: string; target?: string };
  }>;
}

interface Props {
  logo: MakeswiftLogoProps;
  sections: MakeswiftSectionProps[];
  copyright?: string;
}

function combineSections(
  passedSections: Section[],
  makeswiftSections: MakeswiftSectionProps[],
): Section[] {
  return mergeSections(
    passedSections,
    makeswiftSections.map(({ title, links }) => ({
      title,
      links: links.map(({ label, link }) => ({ label, href: link.href })),
    })),
    (left, right) => ({ ...left, links: [...left.links, ...right.links] }),
  );
}

export function MakeswiftFooter({ logo, sections, copyright }: Props) {
  const passedProps = useContext(PropsContext);

  const logoValue: string | { src: string; alt: string } =
    logo.show && logo.src ? { src: logo.src, alt: logo.alt } : passedProps.logo;

  return (
    <Footer
      {...passedProps}
      copyright={copyright ?? passedProps.copyright}
      logo={logoValue}
      logoHeight={logo.show ? logo.height : undefined}
      logoWidth={logo.show ? logo.width : undefined}
      sections={combineSections(passedProps.sections, sections)}
    />
  );
}
