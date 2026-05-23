'use client';

import { useIsInBuilder } from '@makeswift/runtime/react';
import { clsx } from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';

import { CustomerGroupSchema } from './schema';

export const NO_GROUP_ID = 'no-group';

type CustomerGroupData = { customer: { customerGroupId: number } | null };

function useCustomerGroup() {
  const [data, setData] = useState<CustomerGroupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/customer/group')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((json) => {
        setData(CustomerGroupSchema.parse(json));
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
}

function UntargetedGroup() {
  return (
    <div className="p-4 text-center text-lg text-gray-400">
      This group needs to be added to &quot;Targeted customer groups&quot;.
    </div>
  );
}

function getGroupSlot(
  allSlots: Array<{ group?: string; slot: ReactNode }> | undefined,
  simulateGroup: boolean,
  simulatedGroup: string,
  customerGroupId: number | undefined,
  noGroupSlot: ReactNode,
): ReactNode {
  const simulatedSlot = allSlots?.find((s) => s.group === simulatedGroup)?.slot ?? <UntargetedGroup />;
  const actualSlot = allSlots?.find((s) => s.group === `${customerGroupId}`)?.slot ?? <UntargetedGroup />;

  if (!customerGroupId && !simulateGroup) return noGroupSlot;
  return simulateGroup ? simulatedSlot : actualSlot;
}

export function SlotSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(className, 'relative w-full animate-pulse p-2')}>
      <div className="line-clamp-1 h-20 w-full rounded-lg bg-contrast-100" />
    </div>
  );
}

interface Props {
  className: string;
  slots?: Array<{ group?: string; slot: ReactNode }>;
  simulatedGroup?: string;
  noGroupSlot: ReactNode;
}

export function CustomerGroupSlot({
  className,
  slots,
  simulatedGroup = NO_GROUP_ID,
  noGroupSlot,
}: Props) {
  const allSlots = slots?.concat({ group: NO_GROUP_ID, slot: noGroupSlot });
  const isInBuilder = useIsInBuilder();
  const { data, isLoading, error } = useCustomerGroup();

  if (isLoading) return <SlotSkeleton className={className} />;

  if (error) {
    return (
      <p className={clsx(className, 'p-4 text-center text-gray-500')}>
        An error occurred trying to fetch the customer&apos;s group.
      </p>
    );
  }

  const customerGroupId = data?.customer?.customerGroupId;
  const groupSlot = getGroupSlot(allSlots, isInBuilder, simulatedGroup, customerGroupId, noGroupSlot);

  return <div className={className}>{groupSlot}</div>;
}
