import { Checkbox, Image, Slot, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesSiteHeaderClient } from './client';

runtime.registerComponent(GesSiteHeaderClient, {
  type: 'ges-site-header',
  label: 'GES / Site Header',
  icon: 'layout',
  props: {
    className: Style(),
    logoUrl: Image({ label: 'Logo image' }),
    logoAlt: TextInput({ label: 'Logo alt text', defaultValue: 'Logo' }),
    logoText: TextInput({ label: 'Logo text (fallback)', defaultValue: 'BRAND' }),
    homeHref: TextInput({ label: 'Logo link', defaultValue: '/' }),
    sticky: Checkbox({ label: 'Sticky on scroll', defaultValue: false }),
    showSearch: Checkbox({ label: 'Show search icon', defaultValue: true }),
    showAccount: Checkbox({ label: 'Show account icon', defaultValue: true }),
    showWishlist: Checkbox({ label: 'Show wishlist icon', defaultValue: false }),
    showCart: Checkbox({ label: 'Show cart icon', defaultValue: true }),
    showLanguage: Checkbox({ label: 'Show language switcher', defaultValue: false }),
    nav: Slot({ unstable_placeholder: { builderOnly: true } }),
  },
});
