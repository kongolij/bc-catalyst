'use client';

import { clsx } from 'clsx';
import Link from 'next/link';

interface MSCardProps {
  className?: string;
  title: string;
  imageSrc?: string;
  imageAlt: string;
  link?: { href?: string; target?: string };
  aspectRatio: '5:6' | '3:4' | '1:1';
  textColorScheme: 'light' | 'dark';
  iconColorScheme: 'light' | 'dark';
  textPosition: 'inside' | 'outside';
  textSize: 'small' | 'medium' | 'large' | 'x-large';
  showOverlay: boolean;
}

const aspectRatioClass: Record<MSCardProps['aspectRatio'], string> = {
  '5:6': 'aspect-[5/6]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

const textSizeClass: Record<MSCardProps['textSize'], string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  'x-large': 'text-xl',
};

export function MSCard({
  className,
  title,
  imageSrc,
  imageAlt,
  link,
  aspectRatio = '5:6',
  textColorScheme = 'light',
  textPosition = 'outside',
  textSize = 'small',
  showOverlay = true,
}: MSCardProps) {
  const textColor = textColorScheme === 'light' ? 'text-white' : 'text-gray-900';
  const textSizeCls = textSizeClass[textSize];

  const imageSection = (
    <div className={clsx('relative overflow-hidden rounded-lg bg-gray-100', aspectRatioClass[aspectRatio])}>
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imageSrc}
        />
      )}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      )}
      {textPosition === 'inside' && (
        <div className={clsx('absolute bottom-4 left-4 right-4', textColor)}>
          <p className={clsx('font-medium', textSizeCls)}>{title}</p>
        </div>
      )}
    </div>
  );

  const card = (
    <div className={clsx('group', className)}>
      {imageSection}
      {textPosition === 'outside' && (
        <p className={clsx('mt-2 font-medium', textSizeCls, textColorScheme === 'dark' ? 'text-gray-900' : 'text-foreground')}>
          {title}
        </p>
      )}
    </div>
  );

  if (link?.href) {
    return (
      <Link href={link.href} target={link.target}>
        {card}
      </Link>
    );
  }

  return card;
}
