import { Color, Group, List, Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesAccordion } from './client';

runtime.registerComponent(GesAccordion, {
  type: 'ges-accordions',
  label: 'GES / Blocks / Accordions',
  icon: 'carousel',
  props: {
    className: Style(),
    accordions: List({
      label: 'Accordions',
      type: Group({
        label: 'Accordion item',
        props: {
          title: TextInput({ label: 'Title', defaultValue: 'This is an accordion title' }),
          bgColor: Color({ label: 'Background Color', defaultValue: '#ffffff' }),
          textColor: Color({ label: 'Text Color', defaultValue: '#000000' }),
          classNameCss: Style({ properties: Style.All }),
          children: Slot(),
        },
      }),
      getItemLabel(accordion) {
        return accordion?.title || 'Accordion';
      },
    }),
    type: Select({
      label: 'Selection type',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'multiple', label: 'Multiple' },
      ],
      defaultValue: 'multiple',
    }),
    colorScheme: Select({
      label: 'Color scheme',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      defaultValue: 'light',
    }),
  },
});
