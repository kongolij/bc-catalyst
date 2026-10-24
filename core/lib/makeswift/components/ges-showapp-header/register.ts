import { Checkbox, Color, Group, Image, List, Number, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesShowAppHeaderClient } from './client';

export const GES_SHOWAPP_HEADER_COMPONENT_TYPE = 'ges-showapp-header';

const link = (label: string, defaultValue: string) => TextInput({ label, defaultValue });

runtime.registerComponent(GesShowAppHeaderClient, {
  type: GES_SHOWAPP_HEADER_COMPONENT_TYPE,
  label: 'GES / Navigation / Show Header (Show App)',
  description:
    'Header whose commerce menu comes from the Show App (show DB + BC): display names, hidden categories, CMS links and dates are managed there.',
  icon: 'navigation',
  props: {
    className: Style(),
    show: Group({
      label: 'Show',
      props: {
        projectNumber: TextInput({ label: 'Project number (blank = first show in the Show App)', defaultValue: '' }),
      },
    }),
    logo: Group({
      label: 'Logo',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        source: Select({
          label: 'Logo source',
          options: [
            { label: 'Default GES logo', value: 'default' },
            { label: 'Custom uploaded logo', value: 'custom' },
          ],
          defaultValue: 'default',
        }),
        image: Image({ label: 'Custom logo image' }),
        alt: TextInput({ label: 'Alt text', defaultValue: 'GES' }),
        text: TextInput({ label: 'Fallback text', defaultValue: 'GES' }),
        href: link('Home link', '/'),
      },
    }),
    staticItems: List({
      label: 'Add new menu items / static pages',
      type: Group({
        label: 'Static menu item',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Show Information' }),
          href: link('Link (optional)', ''),
          position: Select({
            label: 'Position',
            options: [
              { value: 'before', label: 'Before show categories' },
              { value: 'after', label: 'After show categories' },
            ],
            defaultValue: 'after',
          }),
          groups: List({
            label: 'Dropdown groups',
            type: Group({
              label: 'Dropdown group',
              props: {
                label: TextInput({ label: 'Group label', defaultValue: 'Show information' }),
                href: link('Group link (optional)', ''),
                links: List({
                  label: 'Links',
                  type: Group({
                    label: 'Link',
                    props: {
                      label: TextInput({ label: 'Label', defaultValue: 'Quick facts' }),
                      href: link('URL', ''),
                      newTab: Checkbox({ label: 'Open in new tab', defaultValue: false }),
                    },
                  }),
                  getItemLabel: (item) => item?.label || 'Link',
                }),
              },
            }),
            getItemLabel: (item) => item?.label || 'Group',
          }),
        },
      }),
      getItemLabel: (item) => item?.label || 'Static item',
    }),
    appearance: Group({
      label: 'Navigation appearance',
      props: {
        backgroundColor: Color({ label: 'Navigation background color', defaultValue: '#ffffff' }),
      },
    }),
    actions: Group({
      label: 'Header right side',
      props: {
        showLocale: Checkbox({ label: 'Show locale', defaultValue: true }),
        showAccount: Checkbox({ label: 'Show account', defaultValue: true }),
        showBooth: Checkbox({ label: 'Show booth', defaultValue: true }),
        showContact: Checkbox({ label: 'Show contact us', defaultValue: true }),
        showCart: Checkbox({ label: 'Show cart', defaultValue: true }),
        showSearch: Checkbox({ label: 'Show search', defaultValue: true }),
        localeLabel: TextInput({ label: 'Locale label', defaultValue: 'EN' }),
        accountLabel: TextInput({ label: 'Account label', defaultValue: 'Account' }),
        accountHref: link('Account link', '/login'),
        boothLabel: TextInput({ label: 'Booth label', defaultValue: 'Find or Add Your Booth' }),
        boothHref: link('Booth link', '/account/shows'),
        contactLabel: TextInput({ label: 'Contact label', defaultValue: 'Contact Us' }),
        contactHref: link('Contact link', '/contact-us'),
        cartHref: link('Cart link', '/cart'),
        demoCartCount: Number({ label: 'Demo cart count', defaultValue: 2 }),
      },
    }),
    scrollBehavior: Select({
      label: 'Scroll behavior',
      options: [
        { value: 'static', label: 'Static' },
        { value: 'sticky', label: 'Sticky' },
      ],
      defaultValue: 'static',
    }),
  },
});
