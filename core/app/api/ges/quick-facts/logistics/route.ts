import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LOGISTICS_HTML = `
<h3>SHIPPING TO THE SHOW WITH GES LOGISTICS - WE CAN SHIP IT FOR YOU</h3>
<p>Let us handle all your shipping needs and enjoy priority move-in/move-out and more.</p>
<p>With decades of trade show experience, GES Logistics understands your transportation needs. As the Official Services Provider for your show, we offer a variety of fully integrated services and competitive rates that include:</p>
<ul>
  <li>One-way or roundtrip shipping to and from the show floor</li>
  <li>Priority move-in/move-out</li>
  <li>Online tracking 24/7</li>
  <li>Onsite GES support team</li>
</ul>
<p>Roundtrip domestic logistics for non-local shipments of 5,000 lbs or less is called Transportation Plus and also gets you:</p>
<ul>
  <li>10% off material handling</li>
  <li>Free weight certificate</li>
  <li>No carrier wait time fees</li>
  <li>All GES tradeshow services within one invoice (No need to track invoicing from other carriers)</li>
</ul>
<p>GES will not act as Importer of Record (IOR) or Ultimate Consignee regarding exhibitor freight and will not provide a Power of Attorney to any entity regarding exhibitor freight.</p>
`.trim();

export function GET() {
  return NextResponse.json({ html: LOGISTICS_HTML });
}
