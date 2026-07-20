import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HARDCODED_DATES = [
  {
    id: 'move-in',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    scheduleType: 'Move-In',
    scheduleNotes: 'Exhibitor move-in and booth setup',
  },
  {
    id: 'show-open',
    startDate: '2026-08-13',
    endDate: '2026-08-15',
    scheduleType: 'Show Days',
    scheduleNotes: 'Show open to attendees, 9:00 AM – 6:00 PM',
  },
  {
    id: 'move-out',
    startDate: '2026-08-16',
    endDate: '2026-08-16',
    scheduleType: 'Move-Out',
    scheduleNotes: 'All exhibitors must vacate by 6:00 PM',
  },
  {
    id: 'freight-deadline',
    startDate: '2026-08-01',
    endDate: '2026-08-01',
    scheduleType: 'Freight Deadline',
    scheduleNotes: 'Last day for discounted advance warehouse shipments',
  },
];

export function GET() {
  return NextResponse.json({ dates: HARDCODED_DATES });
}
