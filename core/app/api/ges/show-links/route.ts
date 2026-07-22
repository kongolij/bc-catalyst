import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SHIPPING = {
  title: 'Shipping and Material Handling',
  description:
    'Get your materials to the show floor safely and on time. Our comprehensive shipping services ensure your booth materials arrive when you need them.',
  links: [
    { label: 'Get a Shipping Quote', href: '/shipping/quote' },
    { label: 'Shipping to the Show', href: '/shipping/to-show' },
    { label: 'GES Material Handling+', href: '/material-handling' },
    { label: 'Material Handling FAQ', href: '/material-handling/faq' },
  ],
};

const RESOURCES = {
  title: 'Resources and Information',
  links: [
    { label: 'Official Service Provider Information', href: '/resources/service-provider' },
    { label: 'GES Terms & Conditions of Contract', href: '/resources/terms' },
    { label: 'Payment Policy', href: '/resources/payment-policy' },
    { label: 'Show Site Work Rules', href: '/resources/work-rules' },
    { label: 'Stop. Think. Safety.', href: '/resources/safety' },
    { label: 'Fire Regulations', href: '/resources/fire-regulations' },
  ],
};

const HELP = {
  title: 'Need Help?',
  contacts: [
    { label: 'GES Customer Service', number: '(800) 475-2098' },
    { label: 'Show Site Support', number: '(702) 515-5970' },
  ],
};

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');

  if (section === 'shipping') return NextResponse.json(SHIPPING);
  if (section === 'resources') return NextResponse.json(RESOURCES);
  if (section === 'help') return NextResponse.json(HELP);

  return NextResponse.json({ shipping: SHIPPING, resources: RESOURCES, help: HELP });
}
