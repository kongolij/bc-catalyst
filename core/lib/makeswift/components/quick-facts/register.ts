import { Checkbox, Group, Image, Link, List, Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { fromApiControl } from '../_shared/schemas';
import { QuickFactsClient } from './client';

const importantDatesListControl = List({
  label: 'Important Dates List',
  type: Group({
    label: 'Date Item',
    props: {
      startDate: TextInput({ label: 'Start Date (UTC)', defaultValue: new Date().toISOString() }),
      endDate: TextInput({ label: 'End Date (UTC)', defaultValue: new Date().toISOString() }),
      scheduleType: TextInput({ label: 'Schedule Type', defaultValue: '' }),
      scheduleNotes: TextInput({ label: 'Schedule Notes', defaultValue: '' }),
      includeInCalender: Checkbox({ label: 'Include in Calendar?', defaultValue: true }),
      showInList: Checkbox({ label: 'Show in List?', defaultValue: true }),
    },
  }),
  getItemLabel(item) {
    return item?.scheduleNotes ?? 'Date Item';
  },
});

const breadcrumbsDataControl = Group({
  label: 'Breadcrumbs Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    breadcrumbsList: List({
      label: 'Breadcrumbs',
      type: Group({
        label: 'Breadcrumb',
        props: {
          label: TextInput({ label: 'Label', defaultValue: 'Home' }),
          href: TextInput({ label: 'URL', defaultValue: '/' }),
        },
      }),
      getItemLabel(item) {
        return item?.label ?? 'Breadcrumb';
      },
    }),
  },
});

runtime.registerComponent(QuickFactsClient, {
  type: 'quick-facts-page',
  label: 'GES / Pages / Quick Facts',
  icon: 'layout',
  hidden: true,
  props: {
    quickFactsData: Group({
      label: 'Quick Facts Data',
      props: {
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

        breadcrumbsData: breadcrumbsDataControl,

        whatsIncludedData: Group({
          label: "What's Included",
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: "What's Included" }),
            messageData: Slot(),
          },
        }),

        importantDatesDeadlineData: Group({
          label: 'Important Dates & Deadlines',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Important Dates & Deadlines' }),
            descriptionTitle: TextInput({ label: 'Description Title', defaultValue: '' }),
            description: TextInput({ label: 'Description', defaultValue: '' }),
            importantDatesList: importantDatesListControl,
          },
        }),

        shippingWarehouseData: Group({
          label: 'Shipping & Warehouse',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'Shipping Addresses' }),
            generateLabelName: TextInput({ label: 'Generate Label Name', defaultValue: 'Shipping Address' }),
            generateLabelLink: Link({ label: 'Generate Label Link' }),
            shippingAddress: List({
              label: 'Shipping Address List',
              type: Group({
                label: 'Shipping Address Item',
                props: {
                  shipmentBlock: List({
                    label: 'Shipment Block',
                    type: Group({
                      label: 'Block Item',
                      props: {
                        title: TextInput({ label: 'Title', defaultValue: 'Shipping Address' }),
                        content: List({
                          label: 'Content Lines',
                          type: TextInput({ label: 'Line', defaultValue: '' }),
                        }),
                      },
                    }),
                  }),
                  arrayListStyle: List({
                    label: 'Disc List',
                    type: TextInput({ label: 'Item', defaultValue: '' }),
                  }),
                  summary: List({
                    label: 'Summary',
                    type: Group({
                      label: 'Summary Item',
                      props: {
                        summaryItem: TextInput({ label: 'Text (use || for link)', defaultValue: '' }),
                        summaryLinkLabel: TextInput({ label: 'Link Label', defaultValue: '' }),
                        summaryLink: Link({ label: 'Link' }),
                      },
                    }),
                  }),
                },
              }),
            }),
          },
        }),

        logisticsSectionData: Group({
          label: 'Logistics Section',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            title: TextInput({ label: 'Title', defaultValue: 'GES Logistics' }),
            subtitle: TextInput({ label: 'Subtitle', defaultValue: 'Shipping to the Show with GES Logistics' }),
            descriptionList: List({
              label: 'Description List',
              type: Group({
                label: 'Description Item',
                preferredLayout: 'makeswift::controls::group::layout::popover',
                props: {
                  label: TextInput({ label: 'Text', defaultValue: '' }),
                  listLabel: List({
                    label: 'Bullet List',
                    type: TextInput({ label: 'Bullet Item', defaultValue: '' }),
                  }),
                },
              }),
              getItemLabel(item) {
                return item?.label ?? 'Description Item';
              },
            }),
            domesticQuote: Group({
              label: 'Domestic Quote',
              preferredLayout: 'makeswift::controls::group::layout::popover',
              props: {
                name: TextInput({ label: 'Name', defaultValue: 'Request a Quote for Domestic Logistics' }),
                link: Link({ label: 'Link' }),
              },
            }),
            internationalQuote: Group({
              label: 'International Quote',
              preferredLayout: 'makeswift::controls::group::layout::popover',
              props: {
                name: TextInput({ label: 'Name', defaultValue: 'Request a Quote for International Logistics' }),
                link: Link({ label: 'Link' }),
              },
            }),
          },
        }),
      },
    }),
  },
});
