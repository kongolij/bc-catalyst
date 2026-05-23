import {
  Checkbox,
  Group,
  Image,
  Link,
  List,
  Select,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftHeader } from './client';

export const COMPONENT_TYPE = 'catalyst-makeswift-header';

runtime.registerComponent(MakeswiftHeader, {
  type: COMPONENT_TYPE,
  label: 'Site Header',
  hidden: true,
  props: {
    siteLogo: Group({
      label: 'Site Logo',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        fromApi: Checkbox({ label: 'From API?', defaultValue: true }),
        isLink: Checkbox({ label: 'Is Link?', defaultValue: true }),
        link: Link({ label: 'Logo Link' }),
        desktop: Group({
          label: 'Desktop Logo',
          props: {
            isIcon: Select({
              label: 'Icon',
              options: [
                { value: 'desktop-logo', label: 'Desktop Icon' },
                { value: 'mobile-logo', label: 'Mobile Icon' },
                { value: '', label: 'Choose Image' },
              ],
              defaultValue: 'desktop-logo',
            }),
            alt: TextInput({ label: 'Alt', defaultValue: 'Logo' }),
            src: Image({ label: 'Image' }),
            width: TextInput({ label: 'Width', defaultValue: '200' }),
            height: TextInput({ label: 'Height', defaultValue: '40' }),
          },
        }),
        mobile: Group({
          label: 'Mobile Logo',
          props: {
            isIcon: Select({
              label: 'Icon',
              options: [
                { value: 'desktop-logo', label: 'Desktop Icon' },
                { value: 'mobile-logo', label: 'Mobile Icon' },
                { value: '', label: 'Choose Image' },
              ],
              defaultValue: 'mobile-logo',
            }),
            alt: TextInput({ label: 'Alt', defaultValue: 'Logo' }),
            src: Image({ label: 'Image' }),
            width: TextInput({ label: 'Width', defaultValue: '102' }),
            height: TextInput({ label: 'Height', defaultValue: '41' }),
          },
        }),
      },
    }),
    megaMenuData: List({
      label: 'Navigation Links',
      type: Group({
        label: 'Nav Item',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Link' }),
          href: Link({ label: 'Link' }),
          groups: List({
            label: 'Dropdown Items',
            type: Group({
              label: 'Dropdown Item',
              props: {
                label: TextInput({ label: 'Text', defaultValue: 'Text' }),
                isLink: Checkbox({ label: 'Is Link?', defaultValue: true }),
                href: Link({ label: 'Link' }),
                links: List({
                  label: 'Sub Items',
                  type: Group({
                    label: 'Sub Item',
                    props: {
                      label: TextInput({ label: 'Text', defaultValue: 'Text' }),
                      href: Link({ label: 'URL' }),
                    },
                  }),
                  getItemLabel: (item) => item?.label ?? 'Text',
                }),
              },
            }),
            getItemLabel: (item) => item?.label ?? 'Text',
          }),
        },
      }),
      getItemLabel: (item) => item?.label ?? 'Text',
    }),
    headerRightSide: Group({
      label: 'Header Right Side',
      props: {
        isLocale: Checkbox({ label: 'Show Locale', defaultValue: true }),
        isAccount: Checkbox({ label: 'Show Account', defaultValue: true }),
        isBooth: Checkbox({ label: 'Show Booth', defaultValue: true }),
        isContactUs: Checkbox({ label: 'Show Contact Us', defaultValue: true }),
        isCart: Checkbox({ label: 'Show Cart', defaultValue: true }),
        isSearch: Checkbox({ label: 'Show Search', defaultValue: true }),
      },
    }),
  },
});
