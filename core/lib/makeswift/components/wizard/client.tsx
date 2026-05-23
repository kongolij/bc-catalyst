'use client';

import { type ReactNode } from 'react';

interface CardSlot {
  description: ReactNode;
}

interface Props {
  titleData?: {
    fromApi?: boolean;
    title?: string;
  };
  cardData?: {
    fromApi?: boolean;
    cards?: CardSlot[];
  };
  buttonData?: {
    fromApi?: boolean;
    buttonName?: string;
  };
}

export function WizardLanding({ titleData, cardData, buttonData }: Props) {
  const title = titleData?.title ?? 'GES Wizard';
  const cards = cardData?.cards ?? [];
  const buttonName = buttonData?.buttonName ?? 'Start';

  return (
    <div className="flex flex-col gap-8 py-8">
      {title && (
        <h1 className="text-center text-2xl font-bold md:text-3xl">{title}</h1>
      )}

      {cards.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <div
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              key={i}
            >
              {card.description}
            </div>
          ))}
        </div>
      )}

      {cards.length === 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              className="h-40 rounded-lg border border-dashed border-gray-300 bg-gray-50"
              key={i}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button className="rounded-[40px] bg-[#E06A26] px-12 py-3 text-base font-medium text-white transition-colors hover:bg-[#E06A26]/90">
          {buttonName}
        </button>
      </div>
    </div>
  );
}
