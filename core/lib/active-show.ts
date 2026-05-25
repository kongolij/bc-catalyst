'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'active-show';

export interface ActiveShow {
  showId: string;
  priceListId: number;
}

export async function getActiveShow(): Promise<ActiveShow | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  if (!raw) return null;

  try {
    return JSON.parse(raw) as ActiveShow;
  } catch {
    return null;
  }
}

export async function setActiveShow(showId: string, priceListId: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, JSON.stringify({ showId, priceListId }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}
