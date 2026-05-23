import { Group, Link, List, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import {
  breadcrumbsSchema,
  exhibitorDataSchema,
  fromApiControl,
  titleSchema,
} from '../_shared/schemas';
import { MoveInClient } from './client';

const moveOutNoticeControl = Group({
  label: 'Move Out Notice Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    description: TextInput({
      label: 'Description (use || for link)',
      defaultValue: '',
    }),
    linkLabel: TextInput({ label: 'Link Label', defaultValue: '' }),
    link: Link({ label: 'Link' }),
  },
});

const keyDatesAndTimesControl = Group({
  label: 'Key Dates And Times Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    titleData: titleSchema,

    moveInDateData: Group({
      label: 'Move In Date Data',
      props: {
        fromApi: fromApiControl,
        title: TextInput({ label: 'Title', defaultValue: 'Exhibitor Move-in:' }),
        moveInDate: List({
          label: 'Move In Dates',
          type: TextInput({ label: 'Date', defaultValue: '' }),
          getItemLabel(item) {
            return item ?? 'Date';
          },
        }),
      },
    }),

    moveInNotesData: Group({
      label: 'Move In Notes Data',
      preferredLayout: 'makeswift::controls::group::layout::popover',
      props: {
        fromApi: fromApiControl,
        title: TextInput({ label: 'Title', defaultValue: 'Move-In Notes' }),
        moveInNotesList: List({
          label: 'Notes',
          type: Group({
            label: 'Note Item',
            props: {
              title: TextInput({ label: 'Title', defaultValue: '' }),
              titleLink: Link({ label: 'Title Link' }),
              content: TextArea({ label: 'Content', defaultValue: '' }),
            },
          }),
          getItemLabel(item) {
            return item?.title ?? 'Note';
          },
        }),
      },
    }),

    moveOutNoticeData: moveOutNoticeControl,
  },
});

runtime.registerComponent(MoveInClient, {
  type: 'move-in-page',
  label: 'GES / Move In Page',
  icon: 'layout',
  hidden: true,
  props: {
    moveInObjectData: Group({
      label: 'Move In Notice',
      props: {
        titleData: titleSchema,
        breadcrumbsData: breadcrumbsSchema,
        exhibitorData: exhibitorDataSchema,
        keyDatesAndTimesData: keyDatesAndTimesControl,
        successCentralData: exhibitorDataSchema,
      },
    }),
  },
});
