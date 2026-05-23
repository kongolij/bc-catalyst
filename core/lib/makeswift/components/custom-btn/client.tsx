'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';

type ImageProps = {
  title?: string;
  src?: string;
  width?: string;
  height?: string;
};

type TextBoxItem = {
  text?: string;
  link?: { href: string; target?: '_self' | '_blank' };
  pTop?: string;
  pBottom?: string;
  pLeft?: string;
  pRight?: string;
  textColor?: string;
  hoverTextColor?: string;
  hoverOutTextColor?: string;
  isImage?: boolean;
  imageAttr?: ImageProps;
  isRefresh?: boolean;
  isPopUp?: boolean;
  popupContent?: ReactNode;
};

type CustomStyles = {
  hoverBgColor?: string;
  hoverBorderColor?: string;
  hoverOutBgColor?: string;
  hoverOutBorderColor?: string;
  bgColor?: string;
  customHeight?: string;
};

type Props = {
  className?: string;
  items?: TextBoxItem[];
  customStyle?: CustomStyles;
};

export default function CustomBtn({ className, items, customStyle }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!customStyle) return;
    if (customStyle.hoverBgColor) e.currentTarget.style.backgroundColor = customStyle.hoverBgColor;
    if (customStyle.hoverBorderColor) e.currentTarget.style.borderColor = customStyle.hoverBorderColor;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!customStyle) return;
    e.currentTarget.style.backgroundColor = customStyle.hoverOutBgColor ?? customStyle.bgColor ?? '#ffffff';
    e.currentTarget.style.borderColor = customStyle.hoverOutBorderColor ?? '#B4DDE9';
  };

  const renderContent = (item?: TextBoxItem) =>
    item?.isImage ? (
      <Image
        alt={item.imageAttr?.title ?? 'icon'}
        height={Number(item.imageAttr?.height) || 24}
        src={item.imageAttr?.src ?? ''}
        width={Number(item.imageAttr?.width) || 24}
      />
    ) : (
      <>{item?.text}</>
    );

  return (
    <button
      className={clsx(
        'custom-class box-border flex !w-fit items-center justify-center gap-[5px] rounded-[3px] transition-all duration-500 ease-in-out',
        className,
      )}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      style={{
        backgroundColor: customStyle?.bgColor ?? 'white',
        height: customStyle?.customHeight ?? 'auto',
      }}
    >
      {items?.map((item, index) => {
        if (!item) return null;

        const baseStyles = {
          paddingTop: item.pTop,
          paddingBottom: item.pBottom,
          paddingLeft: item.pLeft,
          paddingRight: item.pRight,
          color: item.textColor,
        };

        const hoverEvents = {
          onMouseOver: (e: React.MouseEvent<HTMLElement>) => {
            if (item.hoverTextColor) (e.currentTarget as HTMLElement).style.color = item.hoverTextColor;
          },
          onMouseOut: (e: React.MouseEvent<HTMLElement>) => {
            if (item.hoverOutTextColor) (e.currentTarget as HTMLElement).style.color = item.hoverOutTextColor;
          },
        };

        if (item.isRefresh) {
          return (
            <div
              key={index}
              {...hoverEvents}
              className="h-full cursor-pointer font-medium leading-8 tracking-wide"
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              style={baseStyles}
            >
              {renderContent(item)}
            </div>
          );
        }

        if (item.isPopUp) {
          return (
            <Dialog.Root
              key={index}
              open={openIndex === index}
              onOpenChange={(open) => setOpenIndex(open ? index : null)}
            >
              <Dialog.Trigger asChild>
                <div
                  {...hoverEvents}
                  className="h-full cursor-pointer font-medium leading-8 tracking-wide"
                  style={baseStyles}
                >
                  {renderContent(item)}
                </div>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[95vh] w-[90vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
                  <div className="flex justify-end">
                    <Dialog.Close className="cursor-pointer rounded bg-transparent px-2 py-1.5 text-black transition-all hover:bg-gray-700 hover:text-white">
                      <X height={20} width={20} />
                    </Dialog.Close>
                  </div>
                  {item.popupContent && <div>{item.popupContent}</div>}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          );
        }

        return (
          <Link
            key={index}
            {...hoverEvents}
            className="h-full font-medium leading-8 tracking-wide"
            href={item.link?.href ?? '#'}
            rel="noopener noreferrer"
            style={baseStyles}
            target={item.link?.target ?? '_self'}
          >
            {renderContent(item)}
          </Link>
        );
      })}
    </button>
  );
}
