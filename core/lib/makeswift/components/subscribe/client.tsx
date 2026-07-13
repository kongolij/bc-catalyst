import { Subscribe } from '~/components/subscribe';

interface Props {
  className?: string;
}

export function MSSubscribe({ className }: Props) {
  return (
    <div className={className}>
      <Subscribe />
    </div>
  );
}
