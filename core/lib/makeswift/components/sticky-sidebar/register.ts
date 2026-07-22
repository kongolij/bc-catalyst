import { Select, Slot, Style } from '@makeswift/runtime/controls';

import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';
import { runtime } from '~/lib/makeswift/runtime';

const spacingOptions = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'X-Large' },
] as const;

runtime.registerComponent(StickySidebarLayout, {
  type: 'layouts-sticky-sidebar',
  label: 'Layouts / Sticky Sidebar',
  icon: 'layout',
  props: {
    className: Style({ properties: [...Style.Default, Style.Border] }),
    sidebar: Slot(),
    children: Slot(),
    containerSize: Select({
      label: 'Container size',
      options: [
        { value: 'md', label: 'Medium (768px)' },
        { value: 'lg', label: 'Large (1024px)' },
        { value: 'xl', label: 'XL (1280px)' },
        { value: '2xl', label: '2XL (1536px)' },
        { value: 'wide', label: 'Wide (1760px)' },
        { value: 'full', label: 'Full width' },
      ],
      defaultValue: '2xl',
    }),
    sidebarPosition: Select({
      label: 'Sidebar position',
      options: [
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
      ],
      defaultValue: 'before',
    }),
    sidebarSize: Select({
      label: 'Sidebar width',
      options: [
        { value: '1/2', label: '1/2' },
        { value: '2/5', label: '2/5' },
        { value: '1/3', label: '1/3' },
        { value: '3/8', label: '3/8' },
        { value: '1/4', label: '1/4' },
        { value: '1/5', label: '1/5' },
        { value: 'x-small', label: 'X-Small (160px)' },
        { value: 'small', label: 'Small (192px)' },
        { value: 'medium', label: 'Medium (240px)' },
        { value: 'large', label: 'Large (320px)' },
        { value: 'x-large', label: 'X-Large (384px)' },
      ],
      defaultValue: '1/3',
    }),
    padding: Select({
      label: 'Outer padding',
      options: spacingOptions,
      defaultValue: 'lg',
    }),
    columnGap: Select({
      label: 'Gap between columns',
      options: spacingOptions,
      defaultValue: 'lg',
    }),
    rowGap: Select({
      label: 'Gap when stacked (mobile)',
      options: spacingOptions,
      defaultValue: 'md',
    }),
    stickyTop: Select({
      label: 'Sidebar sticky offset',
      options: spacingOptions,
      defaultValue: 'md',
    }),
  },
});
