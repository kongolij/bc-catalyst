import { Checkbox, Color, Group, List, Select, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesAccordionPage } from './client';

runtime.registerComponent(GesAccordionPage, {
  type: 'primitive-accordions-page',
  label: 'GES / Accordions Page',
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
          children: Slot(),
          isPage: Checkbox({ label: 'Is Page', defaultValue: false }),
          pageType: Select({
            label: 'Page Type',
            options: [
              { value: 'move-in', label: 'Move In' },
              { value: 'move-out', label: 'Move Out' },
              { value: 'others', label: 'Others' },
            ],
            defaultValue: 'move-in',
          }),
          pageURL: TextInput({
            label: 'Page URL',
            defaultValue: '',
            description: "Please don't use project code url if you choose the page type as others",
          }),
          classNameCss: Style({ properties: Style.All }),
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
