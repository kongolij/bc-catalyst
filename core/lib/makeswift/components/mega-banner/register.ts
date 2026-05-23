import { Checkbox, Group, Image, Link, List, Slot, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { fromApiControl } from '../_shared/schemas';
import { MegaBanner } from './client';

const isOwnDesignControl = Checkbox({ label: 'Is Own Design', defaultValue: false });
const ownDesignControl = Slot();

const bannerSectionControl = List({
  label: 'Banner Section',
  type: Group({
    label: 'Banner Item',
    props: {
      title: TextInput({ label: 'Title', defaultValue: 'Save Over 25%' }),
      description: TextArea({
        label: 'Description',
        defaultValue: "Don't miss the discount deadline.",
      }),
      btnName: TextInput({ label: 'Button Name', defaultValue: 'Save Now' }),
      btnLink: Link({ label: 'Button Link' }),
      imageSrc: Image({ label: 'Image' }),
    },
  }),
  getItemLabel(item) {
    return item?.title || 'Banner Item';
  },
});

runtime.registerComponent(MegaBanner, {
  type: 'mega-banner',
  label: 'GES / Mega Banner',
  icon: 'carousel',
  hidden: true,
  props: {
    megaBannerData: Group({
      label: 'Mega Banner Data',
      props: {
        topBanner: Group({
          label: 'Top Banner',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            isOwnDesign: isOwnDesignControl,
            ownDesign: ownDesignControl,
            hidePathName: TextArea({
              label: 'Hide Path Names',
              defaultValue:
                '/, /login, /register, /forgot-password, /reset-password, /change-password, /account',
            }),
            title: TextInput({
              label: 'Title',
              defaultValue: 'Build a Better Booth, For a Better Price.',
            }),
          },
        }),
        bottomBanner: Group({
          label: 'Bottom Banner',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            isOwnDesign: isOwnDesignControl,
            ownDesign: ownDesignControl,
            hidePathName: TextArea({
              label: 'Hide Path Names',
              defaultValue:
                '/, /login, /register, /forgot-password, /reset-password, /change-password, /account',
            }),
            bannerSection: bannerSectionControl,
          },
        }),
      },
    }),
  },
});
