import { init } from '@contentful/app-sdk';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
const element = document.getElementById('root');
if (!element) throw new Error('Root element was not found.');
const root = createRoot(element);
init((sdk) => root.render(<StrictMode><App sdk={sdk} /></StrictMode>));
