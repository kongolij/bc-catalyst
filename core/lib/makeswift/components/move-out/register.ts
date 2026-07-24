import { Group, Link, List, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import {
  breadcrumbsSchema,
  exhibitorDataSchema,
  fromApiControl,
  titleSchema,
} from '../_shared/schemas';
import { MoveOutClient } from './client';

const moveOutTimesControl = Group({
  label: 'Move Out Times Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    moveOutTimesList: List({
      label: 'Move Out Times',
      type: Group({
        label: 'Times Item',
        props: {
          title: TextInput({ label: 'Title', defaultValue: '' }),
          moveOutNotesList: List({
            label: 'Notes',
            type: Group({
              label: 'Note Item',
              props: {
                title: TextInput({ label: 'Title', defaultValue: '' }),
                moveOutNotesList: List({
                  label: 'Dates',
                  type: Group({
                    label: 'Date Group',
                    props: {
                      moveOutDatesList: List({
                        label: 'Date List',
                        type: TextInput({ label: 'Date', defaultValue: '' }),
                        getItemLabel(item) {
                          return item ?? 'Date';
                        },
                      }),
                    },
                  }),
                }),
              },
            }),
            getItemLabel(item) {
              return item?.title ?? 'Note';
            },
          }),
        },
      }),
      getItemLabel(item) {
        return item?.title ?? 'Times Item';
      },
    }),
  },
});

const moveInNoticeInlineControl = Group({
  label: 'Move In Notice Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    title: TextInput({ label: 'Title', defaultValue: '' }),
    description: TextInput({ label: 'Description (use || for link)', defaultValue: '' }),
    linkLabel: TextInput({ label: 'Link Label', defaultValue: '' }),
    link: Link({ label: 'Link' }),
  },
});

const moveOutNotesControl = Group({
  label: 'Move Out Notice Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    title: TextInput({ label: 'Title', defaultValue: 'Move-Out Notice' }),
    moveOutNotesList: List({
      label: 'Move Out Notes',
      type: Group({
        label: 'Note Item',
        props: {
          boldTitle: TextInput({
            label: 'Bold Title',
            defaultValue: '',
            description: 'Use |b| in title field where bold should appear',
          }),
          title: TextInput({ label: 'Title', defaultValue: '' }),
          boldContent: TextInput({
            label: 'Bold Content',
            defaultValue: '',
            description: 'Use |b| in content field where bold should appear',
          }),
          content: TextArea({ label: 'Content', defaultValue: '' }),
        },
      }),
    }),
    moveInNoticeData: moveInNoticeInlineControl,
  },
});

const moveInNoticeOuterControl = Group({
  label: 'Move In Notice Data',
  preferredLayout: 'makeswift::controls::group::layout::popover',
  props: {
    fromApi: fromApiControl,
    description: TextInput({ label: 'Description (use || for link)', defaultValue: '' }),
    linkLabel: TextInput({ label: 'Link Label', defaultValue: '' }),
    link: Link({ label: 'Link' }),
  },
});

runtime.registerComponent(MoveOutClient, {
  type: 'move-out-page',
  label: 'GES / Pages / Move Out',
  icon: 'layout',
  hidden: true,
  props: {
    moveOutObjectData: Group({
      label: 'Move Out Notice',
      props: {
        titleData: titleSchema,
        breadcrumbsData: breadcrumbsSchema,
        exhibitorData: exhibitorDataSchema,
        keyDatesAndTimesData: Group({
          label: 'Key Dates And Times Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            moveOutTimesData: moveOutTimesControl,
            moveOutNotesData: moveOutNotesControl,
            moveInNoticeData: moveInNoticeOuterControl,
          },
        }),
        successCentralData: exhibitorDataSchema,
        summaryData: Group({
          label: 'Summary Data',
          preferredLayout: 'makeswift::controls::group::layout::popover',
          props: {
            fromApi: fromApiControl,
            summaryList: List({
              label: 'Summary List',
              type: TextInput({ label: 'Item', defaultValue: '' }),
              getItemLabel(item) {
                return item ?? 'Item';
              },
            }),
          },
        }),
      },
    }),
  },
});
