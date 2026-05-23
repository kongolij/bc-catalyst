'use client';

import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from 'react';

export const DescriptionSource = {
  CatalogPlainText: 'CatalogPlainText',
  CatalogRichText: 'CatalogRichText',
  Custom: 'Custom',
} as const;

export type DescriptionSourceType = (typeof DescriptionSource)[keyof typeof DescriptionSource];

export interface ContentDataProps {
  title?: string;
  content?: string[];
}

export interface ContentBlockProps {
  fromApi?: boolean;
  contentData?: ContentDataProps[];
}

export interface DescriptionTabDataProps {
  hideDescriptionTab?: boolean;
  importantInformationData?: ContentBlockProps;
  labourHoursData?: ContentBlockProps;
  serviceScheduleData?: ContentBlockProps;
}

interface EditableProps {
  descriptionTabData?: DescriptionTabDataProps;
}

export type ProductDetailContextValue = {
  children: ReactNode;
};

const ProductDetailContext = createContext<ProductDetailContextValue | null>(null);

export function ProductDetailContextProvider({
  value,
  children,
}: PropsWithChildren<{ value: ProductDetailContextValue }>) {
  return <ProductDetailContext.Provider value={value}>{children}</ProductDetailContext.Provider>;
}

export function MakeswiftProductDetail({ descriptionTabData }: EditableProps) {
  const ctx = useContext(ProductDetailContext);

  if (ctx == null) {
    return (
      <p className="p-4 text-gray-500">
        MakeswiftProductDetail must be used inside a product page.
      </p>
    );
  }

  return <>{ctx.children}</>;
}
