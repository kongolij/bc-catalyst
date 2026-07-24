import { Combobox, Group, List, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FAQ_CATEGORY_FILES } from '../data';

import { FaqSection } from './section';
import { FaqSectionEmpty } from './section-empty';

type ComboValue = string | { value?: string; id?: string } | undefined;

interface SectionProps {
  hiddenItemIds?: { id?: ComboValue }[];
  overrides?: { itemId?: ComboValue; questionOverride?: string; answerOverride?: string }[];
  additionalItems?: { question?: string; answer?: string }[];
}

function comboToString(v: ComboValue): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    const raw = v.value ?? v.id ?? '';
    return typeof raw === 'string' ? raw.trim() : '';
  }
  return '';
}

for (const file of FAQ_CATEGORY_FILES) {
  const slug = file.category.id;
  const title = file.category.title;
  const baseItems = file.items;

  const options = baseItems.map((i) => {
    const truncated = i.question.length > 70 ? `${i.question.slice(0, 69)}…` : i.question;
    return { id: i.id, value: i.id, label: truncated };
  });

  const Component = (props: SectionProps) => (
    <FaqSection
      additionalItems={props.additionalItems}
      baseItems={baseItems}
      categorySlug={slug}
      hiddenItemIds={props.hiddenItemIds}
      overrides={props.overrides}
      title={title}
    />
  );
  Component.displayName = `FaqSection__${slug}`;

  runtime.registerComponent(Component, {
    type: `ges-faq-section-${slug}`,
    label: `GES / FAQ / Sections / ${title}`,
    icon: 'cube',
    props: {
      hiddenItemIds: List({
        label: 'Hide questions from this section',
        type: Group({
          label: 'Hidden question',
          props: {
            id: Combobox({
              label: 'Question to hide',
              // eslint-disable-next-line @typescript-eslint/require-await
              async getOptions() {
                return options;
              },
            }),
          },
        }),
        getItemLabel: (h) => comboToString(h?.id) || 'question',
      }),

      overrides: List({
        label: 'Edit questions (override the text)',
        type: Group({
          label: 'Override',
          props: {
            itemId: Combobox({
              label: 'Question to edit',
              // eslint-disable-next-line @typescript-eslint/require-await
              async getOptions() {
                return options;
              },
            }),
            questionOverride: TextInput({
              label: 'New question text (blank = keep original)',
              defaultValue: '',
            }),
            answerOverride: TextArea({
              label: 'New answer text (blank = keep original)',
              defaultValue: '',
            }),
          },
        }),
        getItemLabel: (o) =>
          o?.questionOverride || comboToString(o?.itemId) || 'Override',
      }),

      additionalItems: List({
        label: 'Add new questions to this section',
        type: Group({
          label: 'New question',
          props: {
            question: TextInput({ label: 'Question', defaultValue: '' }),
            answer: TextArea({ label: 'Answer', defaultValue: '' }),
          },
        }),
        getItemLabel: (i) => i?.question || 'New question',
      }),
    },
  });
}

// Blank section — no prepopulated content, merchandiser fills it in from scratch.
runtime.registerComponent(FaqSectionEmpty, {
  type: 'ges-faq-section-blank',
  label: 'GES / FAQ / Sections / New FAQ (Blank)',
  icon: 'cube',
  props: {
    title: TextInput({ label: 'Section title', defaultValue: 'New FAQ' }),
    categorySlug: TextInput({
      label: 'Filter slug (leave blank to derive from title; must match a sidebar filter to be shown on click)',
      defaultValue: '',
    }),
    items: List({
      label: 'FAQ items (starts empty — add your own)',
      type: Group({
        label: 'FAQ item',
        props: {
          question: TextInput({ label: 'Question', defaultValue: '' }),
          answer: TextArea({ label: 'Answer', defaultValue: '' }),
        },
      }),
      getItemLabel: (i) => i?.question || 'New question',
    }),
  },
});
