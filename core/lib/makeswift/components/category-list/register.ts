import { Group, List, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSCategoryList } from './client';

runtime.registerComponent(MSCategoryList, {
  type: 'arizon-category-list',
  label: 'Catalog / Category List',
  icon: 'gallery',
  props: {
    className: Style(),
    additionalCategories: List({
      label: 'Categories',
      type: Group({
        label: 'Category',
        props: {
          title: TextInput({ label: 'Title', defaultValue: 'Category title' }),
          entityId: TextInput({
            label: 'Category ID',
            defaultValue: '',
            description: 'Enter the BigCommerce category entity ID',
          }),
        },
      }),
      getItemLabel(category) {
        return category?.title || 'Category';
      },
    }),
  },
});
