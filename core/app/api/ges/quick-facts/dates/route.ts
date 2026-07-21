import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HARDCODED_DATES = [
  {
    id: 'move-in',
    startDate: '2026-08-09T08:00:00',
    endDate: '2026-08-13T15:00:00',
    scheduleType: 'GES Move In',
    scheduleNotes: 'Exhibitor move-in and booth setup',
  },
  {
    id: 'exhibitor-move-out',
    startDate: '2026-08-13T08:00:00',
    endDate: '2026-08-13T17:00:00',
    scheduleType: 'Exhibitor Move-out',
    scheduleNotes: '',
  },
  {
    id: 'ges-move-out',
    startDate: '2026-08-13T18:00:00',
    endDate: '2026-08-13T20:30:00',
    scheduleType: 'GES Move Out',
    scheduleNotes: '',
  },
];

export function GET() {
  return NextResponse.json({ dates: HARDCODED_DATES });
}
