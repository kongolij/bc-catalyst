import { Checkbox, Group, Link, List, TextArea, TextInput } from '@makeswift/runtime/controls';

export const fromApiControl = Checkbox({ label: 'Data from API?', defaultValue: true });

export const breadcrumbsSchema = Group({
  label: 'Breadcrumbs',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    breadcrumbsList: List({
      label: 'Breadcrumbs List',
      type: Group({
        label: 'Breadcrumb',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Home' }),
          href: TextInput({ label: 'URL', defaultValue: '/' }),
        },
      }),
      getItemLabel: (item) => item?.label ?? 'Breadcrumb',
    }),
  },
});

export const bannerSchema = Group({
  label: 'Banner',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    title: TextInput({ label: 'Title', defaultValue: '' }),
    description: TextInput({ label: 'Description', defaultValue: '' }),
  },
});

export const titleSchema = Group({
  label: 'Title',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    title: TextInput({ label: 'Title', defaultValue: '' }),
  },
});

export const exhibitorItemSchema = Group({
  label: 'Item',
  props: {
    title: TextInput({ label: 'Title', defaultValue: '' }),
    description: TextArea({
      label: 'Description',
      description: 'Use || where you want to insert a link',
      defaultValue: '',
    }),
    linkLabel: TextInput({ label: 'Link Label', defaultValue: '' }),
    link: Link({ label: 'Link' }),
  },
});

export const exhibitorListSchema = List({
  label: 'Items',
  type: exhibitorItemSchema,
  getItemLabel: (item) => item?.title ?? 'Item',
});

export const exhibitorDataSchema = Group({
  label: 'Content Section',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    title: TextInput({ label: 'Title', defaultValue: '' }),
    exhibitorList: exhibitorListSchema,
  },
});
