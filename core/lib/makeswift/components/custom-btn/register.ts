import { Checkbox, Group, Image, Link, List, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import CustomBtn from './client';

runtime.registerComponent(CustomBtn, {
  type: 'custom-btn',
  label: 'GES / Buttons / Custom',
  props: {
    items: List({
      label: 'Links',
      type: Group({
        label: 'Link',
        props: {
          isPopUp: Checkbox({ label: 'Pop Up?', defaultValue: false }),
          isRefresh: Checkbox({ label: 'Refresh?', defaultValue: false }),
          isImage: Checkbox({ label: 'Is Image', defaultValue: false }),
          imageAttr: Group({
            label: 'Image Details',
            props: {
              src: Image({ label: 'Image' }),
              title: TextInput({ label: 'Alt Text', defaultValue: 'Image Name' }),
              width: TextInput({ label: 'Width', defaultValue: '20' }),
              height: TextInput({ label: 'Height', defaultValue: '20' }),
            },
          }),
          popupContent: Slot(),
          text: TextInput({ label: 'Text', defaultValue: 'SIGN UP' }),
          link: Link({ label: 'Link' }),
          pLeft: TextInput({ label: 'Padding Left', defaultValue: '0' }),
          pTop: TextInput({ label: 'Padding Top', defaultValue: '5px' }),
          pBottom: TextInput({ label: 'Padding Bottom', defaultValue: '5px' }),
          pRight: TextInput({ label: 'Padding Right', defaultValue: '0' }),
          textColor: TextInput({ label: 'Text Color' }),
          hoverTextColor: TextInput({ label: 'Hover Text Color', defaultValue: '#000000' }),
          hoverOutTextColor: TextInput({ label: 'Mouse-out Text Color', defaultValue: '#000000' }),
        },
      }),
      getItemLabel: (item) => item?.text || 'Link Item',
    }),
    customStyle: Group({
      label: 'Custom Styles',
      props: {
        bgColor: TextInput({ label: 'Background Color', defaultValue: '#ffffff' }),
        customHeight: TextInput({ label: 'Button Height', defaultValue: 'auto' }),
        hoverBgColor: TextInput({ label: 'Hover Background Color', defaultValue: '#E7F5F8' }),
        hoverBorderColor: TextInput({ label: 'Hover Border Color', defaultValue: '#B4DDE9' }),
        hoverOutBgColor: TextInput({ label: 'Mouse-out Background Color' }),
        hoverOutBorderColor: TextInput({ label: 'Mouse-out Border Color', defaultValue: '#B4DDE9' }),
      },
    }),
    className: Style({ properties: Style.All }),
  },
});
