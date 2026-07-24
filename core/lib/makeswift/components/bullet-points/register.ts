import { Checkbox, Color, Group, List, Number, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { BulletPoints } from './client';

runtime.registerComponent(BulletPoints, {
  type: 'bullet-points',
  label: 'GES / Primitives / Bullet Points',
  props: {
    className: Style(),
    items: List({
      label: 'Bullet Points',
      type: Group({
        label: 'Bullet Item',
        props: {
          segments: List({
            label: 'Text Segments',
            type: Group({
              label: 'Segment',
              props: {
                text: TextInput({ label: 'Text', defaultValue: 'Enter text' }),
                isLink: Checkbox({ label: 'Is Link?', defaultValue: false }),
                href: TextInput({ label: 'Link URL', defaultValue: 'https://' }),
                linkColor: Color({ label: 'Link Color', defaultValue: '#0000EE' }),
                underline: Checkbox({ label: 'Underline?', defaultValue: false }),
                fontWeight: Select({
                  label: 'Font Weight',
                  options: [
                    { value: 'normal', label: 'Normal' },
                    { value: 'bold', label: 'Bold' },
                    { value: '100', label: '100 - Thin' },
                    { value: '300', label: '300 - Light' },
                    { value: '400', label: '400 - Regular' },
                    { value: '500', label: '500 - Medium' },
                    { value: '600', label: '600 - Semi Bold' },
                    { value: '700', label: '700 - Bold' },
                    { value: '900', label: '900 - Black' },
                  ],
                  defaultValue: 'normal',
                }),
              },
            }),
            getItemLabel: (item) => item?.text || 'Segment',
          }),
        },
      }),
      getItemLabel: (item) => item?.segments?.map((s) => s.text).join('') || 'Bullet point',
    }),
    bulletColor: Color({ label: 'Bullet Color', defaultValue: '#000000' }),
    textColor: Color({ label: 'Text Color', defaultValue: '#000000' }),
    fontSize: Number({ label: 'Font Size', defaultValue: 16, min: 8, max: 72 }),
    fontFamily: Select({
      label: 'Font Family',
      options: [
        { value: 'inherit', label: 'Default' },
        { value: 'Arial, sans-serif', label: 'Arial' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: '"Times New Roman", serif', label: 'Times New Roman' },
        { value: 'Helvetica, sans-serif', label: 'Helvetica' },
        { value: "'Roboto', sans-serif", label: 'Roboto' },
      ],
      defaultValue: 'inherit',
    }),
  },
});
