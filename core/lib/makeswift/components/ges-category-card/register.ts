import { Image, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { GesCategoryCardClient } from './client';

runtime.registerComponent(GesCategoryCardClient, {
  type: 'ges-category-card',
  label: 'GES / Category Card',
  icon: 'gallery',
  props: {
    className: Style(),
    categoryId: TextInput({
      label: 'Category ID',
      defaultValue: '',
      description: 'BigCommerce top-level category entity ID',
    }),
    titleOverride: TextInput({
      label: 'Title override',
      defaultValue: '',
    }),
    iconUrl: Image({
      label: 'Icon override',
    }),
    hrefOverride: TextInput({
      label: 'Link override',
      defaultValue: '',
    }),
  },
});
