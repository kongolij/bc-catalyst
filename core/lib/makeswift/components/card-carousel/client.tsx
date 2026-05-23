import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
  CarouselScrollbar,
} from '@/vibes/soul/primitives/carousel';
import { clsx } from 'clsx';
import Link from 'next/link';

interface Card {
  title: string;
  imageSrc?: string;
  imageAlt: string;
  link?: { href?: string; target?: string };
}

interface MSCardCarouselProps {
  className?: string;
  cards: Card[];
  aspectRatio: '5:6' | '3:4' | '1:1';
  textColorScheme: 'light' | 'dark';
  iconColorScheme: 'light' | 'dark';
  showScrollbar: boolean;
  showButtons: boolean;
  hideOverflow: boolean;
}

const aspectRatioClass = {
  '5:6': 'aspect-[5/6]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

export function MSCardCarousel({
  className,
  cards = [],
  aspectRatio = '5:6',
  textColorScheme = 'light',
  showScrollbar = true,
  showButtons = true,
  hideOverflow = true,
}: MSCardCarouselProps) {
  if (cards.length === 0) {
    return (
      <div className={clsx('p-4 text-center text-gray-400', className)}>Add cards to the carousel</div>
    );
  }

  return (
    <div className={clsx(className, hideOverflow && 'overflow-hidden')}>
      <Carousel>
        <CarouselContent>
          {cards.map(({ title, imageSrc, imageAlt, link }, index) => (
            <CarouselItem className="basis-full @md:basis-1/2 @lg:basis-1/3 @2xl:basis-1/4" key={index}>
              <Link href={link?.href ?? '#'} target={link?.target}>
                <div className={clsx('relative overflow-hidden rounded-lg bg-gray-100', aspectRatioClass[aspectRatio])}>
                  {imageSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      src={imageSrc}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className={clsx(
                    'absolute bottom-4 left-4 right-4 font-medium text-sm',
                    textColorScheme === 'light' ? 'text-white' : 'text-gray-900',
                  )}>
                    {title}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {(showScrollbar || showButtons) && (
          <div className="mt-6 flex w-full items-center justify-between">
            {showScrollbar && <CarouselScrollbar colorScheme={textColorScheme} />}
            {showButtons && <CarouselButtons colorScheme={textColorScheme} />}
          </div>
        )}
      </Carousel>
    </div>
  );
}
