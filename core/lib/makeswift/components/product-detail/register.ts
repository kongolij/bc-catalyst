import {
  Checkbox,
  Group,
  List,
  Select,
  Slot,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { DescriptionSource, MakeswiftProductDetail } from './client';

export const COMPONENT_TYPE = 'catalyst-makeswift-product-detail-description';

const contentBlockProps = {
  fromApi: Checkbox({ label: 'Data from API?', defaultValue: true }),
  contentData: List({
    label: 'Content Data',
    type: Group({
      label: 'Content Item',
      props: {
        title: TextInput({ label: 'Title', defaultValue: 'Title' }),
        content: List({
          label: 'Content',
          type: TextInput({ label: 'Content', defaultValue: 'Content' }),
          getItemLabel(item) {
            return item ?? 'Item Content';
          },
        }),
      },
    }),
    getItemLabel(item) {
      return item?.title ?? 'Content Item';
    },
  }),
};

runtime.registerComponent(MakeswiftProductDetail, {
  type: COMPONENT_TYPE,
  label: 'Catalog / Product Detail',
  hidden: true,
  props: {
    descriptionTabData: Group({
      label: 'Description tab data',
      props: {
        hideDescriptionTab: Checkbox({ label: 'Hide description tab', defaultValue: false }),
        importantInformationData: Group({
          label: 'Important Information',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: contentBlockProps,
        }),
        labourHoursData: Group({
          label: 'Labour Hours',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: contentBlockProps,
        }),
        serviceScheduleData: Group({
          label: 'Service Schedule',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: contentBlockProps,
        }),
      },
    }),
    description: Group({
      label: 'Description',
      props: {
        source: Select({
          label: 'Source',
          options: [
            { label: 'Catalog (plain text)', value: DescriptionSource.CatalogPlainText },
            { label: 'Catalog (rich text)', value: DescriptionSource.CatalogRichText },
            { label: 'Custom', value: DescriptionSource.Custom },
          ],
          defaultValue: DescriptionSource.CatalogRichText,
        }),
        slot: Slot(),
      },
    }),
  },
});
