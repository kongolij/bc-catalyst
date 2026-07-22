import { Select, Slot, Style } from '@makeswift/runtime/controls';

import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';
import { runtime } from '~/lib/makeswift/runtime';

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
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'XL' },
        { value: '2xl', label: '2XL' },
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
  },
});
