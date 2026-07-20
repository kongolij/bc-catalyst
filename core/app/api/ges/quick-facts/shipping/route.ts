import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HARDCODED_ADDRESSES = [
  {
    id: 'advance-warehouse',
    title: 'Advance Warehouse Address',
    lines: [
      'Exhibiting Company Name / Booth #',
      'c/o GES Logistics',
      '1234 Advance Warehouse Way',
      'Las Vegas, NV 89109',
      'USA',
    ],
    notes: 'Deliveries accepted Mon–Fri, 8:00 AM – 4:00 PM. Discount deadline: 2026-08-01.',
  },
  {
    id: 'show-site',
    title: 'Show Site Address',
    lines: [
      'Exhibiting Company Name / Booth #',
      'c/o GES @ Las Vegas Convention Center',
      '3150 Paradise Rd',
      'Las Vegas, NV 89109',
      'USA',
    ],
    notes: 'Direct-to-show shipments accepted starting 2026-08-10 at 7:00 AM.',
  },
];

export function GET() {
  return NextResponse.json({ addresses: HARDCODED_ADDRESSES });
}
