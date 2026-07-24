import { TextArea, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { FaqItem } from './faq-item';

runtime.registerComponent(FaqItem, {
  type: 'ges-faq-item',
  label: 'GES / FAQ Item',
  icon: 'cube',
  props: {
    question: TextInput({ label: 'Question', defaultValue: 'New question' }),
    answer: TextArea({ label: 'Answer', defaultValue: '' }),
  },
});
