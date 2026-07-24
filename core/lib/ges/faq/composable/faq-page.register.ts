import { Checkbox, Slot, Style, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FaqPage } from './faq-page';

runtime.registerComponent(FaqPage, {
  type: 'ges-faq-page',
  label: 'GES / FAQ Page',
  icon: 'cube',
  props: {
    className: Style(),
    title: TextInput({ label: 'Page title', defaultValue: 'Frequently Asked Questions' }),
    sidebarTitle: TextInput({ label: 'Sidebar title', defaultValue: 'Filter FAQs' }),
    clearLabel: TextInput({ label: 'Clear filter label', defaultValue: '× Clear Filter' }),
    emptyStateTitle: TextInput({
      label: 'Empty-state title',
      defaultValue: 'Choose a category',
    }),
    emptyStateMessage: TextArea({
      label: 'Empty-state message',
      defaultValue: 'Select a topic from the sidebar to view its frequently asked questions.',
    }),
    showCounts: Checkbox({ label: 'Show item counts in sidebar', defaultValue: true }),
    children: Slot(),
  },
});
