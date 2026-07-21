import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    events: [
      { day: '1', month: 'SEPTEMBER', labels: ['GES Move In'] },
      { day: '3', month: 'SEPTEMBER', labels: ['Exhibitor Move-in', 'Direct Delivery to Show Site'] },
      { day: '4', month: 'SEPTEMBER', labels: ['Show Hours'] },
      { day: '6', month: 'SEPTEMBER', labels: ['Exhibitor Move-out'] },
    ],
  });
}
