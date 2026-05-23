import { Color, Number, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSTooltip } from './client';

runtime.registerComponent(MSTooltip, {
  type: 'custom-tooltip',
  label: 'Basic / Tooltip',
  props: {
    className: Style(),
    triggerText: TextInput({ label: 'Trigger Text', defaultValue: 'Hover me' }),
    tooltipContent: TextInput({ label: 'Tooltip Content', defaultValue: 'This is tooltip content' }),
    triggerColor: Color({ label: 'Trigger Text Color', defaultValue: '#dc2626' }),
    tooltipBgColor: Color({ label: 'Tooltip Background Color', defaultValue: '#fff' }),
    tooltipTextColor: Color({ label: 'Tooltip Text Color', defaultValue: '#000' }),
    position: Select({
      label: 'Tooltip Position',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      defaultValue: 'top',
    }),
    zIndex: Number({ label: 'Z-Index', defaultValue: 9999, min: 1, max: 99999, step: 1 }),
    maxWidth: Number({ label: 'Max Width (px)', defaultValue: 180, min: 50, max: 800, step: 10 }),
  },
});
