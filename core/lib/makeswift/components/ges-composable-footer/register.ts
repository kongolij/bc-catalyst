import {
  Checkbox,
  Color,
  Group,
  Image,
  Link,
  List,
  Number,
  Select,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesComposableFooterClient } from './client';

export const GES_COMPOSABLE_FOOTER_COMPONENT_TYPE = 'ges-composable-footer';

const editableLink = Group({
  label: 'Link',
  props: {
    label: TextInput({ label: 'Link text', defaultValue: 'Link' }),
    link: Link({ label: 'Destination' }),
  },
});

runtime.registerComponent(GesComposableFooterClient, {
  type: GES_COMPOSABLE_FOOTER_COMPONENT_TYPE,
  label: 'GES / Navigation / Composable Footer',
  description:
    'Two-row footer: left/center/right navigation regions on top, code-owned logo + legal + contact row below. Ships with the current GES footer as its default.',
  icon: 'navigation',
  props: {
    className: Style(),
    logo: Group({
      label: 'Logo',
      preferredLayout: Group.Layout.Popover,
      props: {
        show: Checkbox({ label: 'Show logo', defaultValue: true }),
        image: Image({ label: 'Logo override (blank keeps GES logo)' }),
        alt: TextInput({ label: 'Alt text', defaultValue: 'GES' }),
        fallbackText: TextInput({ label: 'Text when no image', defaultValue: 'GES' }),
        href: TextInput({ label: 'Home link', defaultValue: '/' }),
        width: Number({ label: 'Logo width', suffix: 'px', defaultValue: 182 }),
      },
    }),
    navigationSections: List({
      label: 'Navigation sections',
      type: Group({
        label: 'Navigation section',
        props: {
          title: TextInput({ label: 'Section title', defaultValue: 'Section' }),
          placement: Select({
            label: 'Placement',
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ],
            defaultValue: 'left',
          }),
          order: Number({
            label: 'Order within region (blank/0 keeps list order)',
            defaultValue: 0,
          }),
          links: List({
            label: 'Links',
            type: editableLink,
            getItemLabel: (item: { label?: string }) => item.label || 'Link',
          }),
        },
      }),
      getItemLabel: (item: { title?: string; placement?: string }) =>
        item.title ? `${item.title} (${item.placement || 'left'})` : 'Navigation section',
    }),
    legalLinks: List({
      label: 'Legal links (blank keeps GES defaults)',
      type: editableLink,
      getItemLabel: (item: { label?: string }) => item.label || 'Legal link',
    }),
    copyright: Group({
      label: 'Copyright row',
      props: {
        show: Checkbox({ label: 'Show copyright', defaultValue: true }),
        includeCurrentYear: Checkbox({
          label: 'Add current year automatically',
          defaultValue: true,
        }),
        text: TextInput({ label: 'Copyright text', defaultValue: '' }),
        additionalLabel: TextInput({
          label: 'Additional legal-link text',
          defaultValue: '',
        }),
        additionalLink: Link({ label: 'Additional legal-link destination' }),
      },
    }),
    contact: Group({
      label: 'Contact button',
      props: {
        show: Checkbox({ label: 'Show contact button', defaultValue: true }),
        label: TextInput({ label: 'Button text', defaultValue: '' }),
        link: Link({ label: 'Button destination' }),
      },
    }),
    appearance: Group({
      label: 'Appearance',
      props: {
        background: Color({ label: 'Background', defaultValue: '#0a2536' }),
        text: Color({ label: 'Body text', defaultValue: '#a8b8c3' }),
        link: Color({ label: 'Link', defaultValue: '#88c5cf' }),
        linkHover: Color({ label: 'Link hover', defaultValue: '#ffffff' }),
        accent: Color({ label: 'Button accent', defaultValue: '#c8d32c' }),
        sectionTitle: Color({ label: 'Section title', defaultValue: '#ffffff' }),
        divider: Color({ label: 'Row divider', defaultValue: 'rgba(255,255,255,0.2)' }),
      },
    }),
  },
});
