import { Checkbox, Group, Image, Link, List, Select, Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { fromApiControl } from '../_shared/schemas';
import { ShowMicroSiteClient } from './client';

runtime.registerComponent(ShowMicroSiteClient, {
  type: 'show-microsite-page',
  label: 'GES / Pages / Show Microsite',
  icon: 'layout',
  hidden: true,
  props: {
    showMicroSiteData: Group({
      label: 'Show Microsite Data',
      props: {
        welcomeMessageData: Group({
          label: 'Welcome Message',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            messageData: Slot(),
          },
        }),

        bannerData: Group({
          label: 'Banner Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: '' }),
            description: TextInput({ label: 'Description', defaultValue: '' }),
            showBannerLogo: Checkbox({ label: 'Show Banner Logo?', defaultValue: false }),
            bannerLogo: Image({ label: 'Banner Logo', format: Image.Format.WithDimensions }),
          },
        }),

        progressBarData: Group({
          label: 'Progress Bar / Timeline',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Show Timeline' }),
            description: TextInput({ label: 'Link Label', defaultValue: 'View Full Schedule' }),
            progressBarList: List({
              label: 'Timeline Items',
              type: Group({
                label: 'Timeline Item',
                props: {
                  timeLineCounter: Checkbox({ label: 'Timeline Counter?', defaultValue: true }),
                  title: TextInput({ label: 'Title', defaultValue: 'Registration' }),
                  date: TextInput({ label: 'Date (UTC)', defaultValue: new Date().toISOString() }),
                },
              }),
              getItemLabel(item) {
                return item?.title ?? 'Timeline Item';
              },
            }),
          },
        }),

        productsAndServicesData: Group({
          label: 'Products & Services',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Products and Services' }),
            productList: List({
              label: 'Product List',
              type: Group({
                label: 'Product Item',
                props: {
                  productName: TextInput({ label: 'Name', defaultValue: 'Electrical & Lighting' }),
                  startDate: TextInput({ label: 'Start Date (UTC)', defaultValue: new Date().toISOString() }),
                  endDate: TextInput({ label: 'End Date (UTC)', defaultValue: new Date().toISOString() }),
                  productImage: Image({ label: 'Product Image' }),
                  prodIcon: Select({
                    label: 'Product Icon',
                    options: [
                      { value: 'Electrical & Lighting', label: 'Electrical & Lighting' },
                      { value: 'Flooring & Graphics', label: 'Flooring & Graphics' },
                      { value: 'Furniture & Fixtures', label: 'Furniture & Fixtures' },
                      { value: 'Material Handling', label: 'Material Handling' },
                      { value: 'Labor & Installation', label: 'Labor & Installation' },
                      { value: 'Security & Cleaning', label: 'Security & Cleaning' },
                      { value: 'Catering & Hospitality', label: 'Catering & Hospitality' },
                      { value: '', label: 'Image Manually' },
                    ],
                    defaultValue: '',
                  }),
                  isLink: Checkbox({ label: 'Is Link?', defaultValue: true }),
                  href: Link({ label: 'Product Link' }),
                },
              }),
              getItemLabel(item) {
                return item?.productName ?? 'Product';
              },
            }),
          },
        }),

        shippingAndMaterialHandlingData: Group({
          label: 'Shipping & Material Handling',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Shipping and Material Handling' }),
            description: TextInput({ label: 'Description', defaultValue: '' }),
            shippingMaterialList: List({
              label: 'Shipping Links',
              type: Group({
                label: 'Shipping Item',
                props: {
                  title: TextInput({ label: 'Title', defaultValue: 'Get a Shipping Quote' }),
                  href: Link({ label: 'Link' }),
                  isLink: Checkbox({ label: 'Is Link?', defaultValue: true }),
                },
              }),
              getItemLabel(item) {
                return item?.title ?? 'Shipping Item';
              },
            }),
          },
        }),

        resourcesAndInformationData: Group({
          label: 'Resources & Information',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Resources and Information' }),
            resourceInformationList: List({
              label: 'Resources',
              type: Group({
                label: 'Resource Item',
                props: {
                  title: TextInput({ label: 'Title', defaultValue: 'Exhibitor Service Kit' }),
                  href: Link({ label: 'Link' }),
                  isLink: Checkbox({ label: 'Is Link?', defaultValue: false }),
                  resourceInformationDesList: List({
                    label: 'Sub-Resources',
                    type: Group({
                      label: 'Sub-Resource Item',
                      props: {
                        title: TextInput({ label: 'Title', defaultValue: 'Exhibitor Service Kit' }),
                        href: Link({ label: 'Link' }),
                        isLink: Checkbox({ label: 'Is Link?', defaultValue: true }),
                      },
                    }),
                    getItemLabel(item) {
                      return item?.title ?? 'Sub-Resource';
                    },
                  }),
                },
              }),
              getItemLabel(item) {
                return item?.title ?? 'Resource';
              },
            }),
          },
        }),

        actionItemsData: Group({
          label: 'Action Items',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Action Items' }),
          },
        }),

        importantDatesData: Group({
          label: 'Important Dates',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Important Dates' }),
            dateNumber: TextInput({ label: 'Countdown Number', defaultValue: '18' }),
            dateUntil: TextInput({ label: 'Countdown Label', defaultValue: 'Days Until Insurance Deadline' }),
            dateList: List({
              label: 'Date List',
              type: Group({
                label: 'Date Item',
                props: {
                  showInList: Checkbox({ label: 'Show in List?', defaultValue: true }),
                  includeInCalender: Checkbox({ label: 'Include in Calendar?', defaultValue: true }),
                  timeLineCounter: Checkbox({ label: 'Timeline Counter?', defaultValue: true }),
                  date: TextInput({ label: 'Start Date', defaultValue: '' }),
                  endDate: TextInput({ label: 'End Date', defaultValue: '' }),
                  description: TextInput({ label: 'Description', defaultValue: '' }),
                },
              }),
              getItemLabel(item) {
                return item?.description ?? 'Date Item';
              },
            }),
          },
        }),

        needHelpData: Group({
          label: 'Need Help',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Need Help?' }),
            descriptionList: List({
              label: 'Description Lines',
              type: Group({
                label: 'Description Item',
                props: {
                  data: TextInput({ label: 'Text', defaultValue: 'Monday - Friday 6:00 am - 4:00 pm PST' }),
                },
              }),
              getItemLabel(item) {
                return item?.data ?? 'Description';
              },
            }),
            needHelpList: List({
              label: 'Help Options',
              type: Group({
                label: 'Help Item',
                props: {
                  title: TextInput({ label: 'Title', defaultValue: 'Live Chat' }),
                  icon: Select({
                    label: 'Icon',
                    options: [
                      { value: 'msg', label: 'Message Icon' },
                      { value: 'call', label: 'Call Icon' },
                    ],
                    defaultValue: 'call',
                  }),
                  href: Link({ label: 'Link' }),
                  isLink: Checkbox({ label: 'Is Link?', defaultValue: true }),
                },
              }),
              getItemLabel(item) {
                return item?.title ?? 'Help Item';
              },
            }),
          },
        }),
      },
    }),
  },
});
