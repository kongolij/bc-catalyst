import { Group, List, TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FAQ_CATEGORY_FILES } from '../data';

import { FaqSection } from './section';

interface SectionProps {
  items?: { question?: string; answer?: string }[];
}

for (const file of FAQ_CATEGORY_FILES) {
  const slug = file.category.id;
  const title = file.category.title;

  const Component = (props: SectionProps) => (
    <FaqSection categorySlug={slug} items={props.items} title={title} />
  );
  Component.displayName = `FaqSection__${slug}`;

  runtime.registerComponent(Component, {
    type: `ges-faq-section-${slug}`,
    label: `GES / FAQ / Sections / ${title}`,
    icon: 'cube',
    props: {
      items: List({
        label: 'FAQ items (prepopulated from flat file — edit inline)',
        type: Group({
          label: 'FAQ item',
          props: {
            question: TextInput({ label: 'Question', defaultValue: '' }),
            answer: TextArea({ label: 'Answer', defaultValue: '' }),
          },
        }),
        defaultValue: file.items.map((i) => ({ question: i.question, answer: i.answer })),
        getItemLabel: (i) => i?.question || 'Untitled question',
      }),
    },
  });
}
