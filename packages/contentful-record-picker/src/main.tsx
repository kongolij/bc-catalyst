import { init } from '@contentful/app-sdk';
import { i18n } from '@lingui/core';
import { compileMessage } from '@lingui/message-utils/compileMessage';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles.css';

i18n.setMessagesCompiler(compileMessage);
i18n.activate('en-US');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

const root = createRoot(rootElement);

init((sdk) => {
  root.render(
    <StrictMode>
      <App sdk={sdk} />
    </StrictMode>,
  );
});