'use client';

import { useState } from 'react';

import { getCookieValue } from '~/lib/client-cookies';
import { useShowLink } from '~/lib/show-link/use-show-link';

const SAMPLES = [
  '/move-in-info',
  'move-in-info',
  '/shipping/material-handling',
  '/move-in-info/',
  '/',
  '/move-in-info?tab=2#hours',
  '/projectcode/move-in-info',
  '/PROJECTCODE/move-in-info',
  '/forms/projectcode/logistics_Quote',
  '/12345/move-in-info',
  '/99999/move-in-info',
  '/cart',
  '/account/orders',
  '/search?term=chair',
  'https://ges.store/move-in-info',
  'https://vendor.com/order',
  '//vendor.com/x',
  '#hours',
  '?tab=2',
  'mailto:help@ges.com',
  'tel:+18005551234',
  '',
];

type Source = 'prop' | 'cookie';

const cell = { padding: '6px 10px', borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace' };
const box = { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4 };
const button = { ...box, background: '#f3f4f6', cursor: 'pointer' };

function Results({ projectCode }: { projectCode: string | null }) {
  const { projectCode: used, resolve } = useShowLink(projectCode);
  const [input, setInput] = useState('/move-in-info');
  const [newTab, setNewTab] = useState(false);

  const live = resolve({ href: input, target: newTab ? '_blank' : undefined });

  return (
    <>
      <p style={{ margin: '16px 0' }}>
        Show used by the hook: <b>{used ?? '(none)'}</b>
      </p>

      <h2 style={{ fontSize: 20, margin: '24px 0 8px' }}>Try a link</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input onChange={(e) => setInput(e.target.value)} style={{ ...box, flex: 1 }} value={input} />
        <label>
          <input checked={newTab} onChange={(e) => setNewTab(e.target.checked)} type="checkbox" /> Open
          in new tab
        </label>
      </div>
      <p style={{ fontFamily: 'monospace', marginTop: 8 }}>
        → href: <b>{live.href ?? 'null (no link drawn)'}</b>
        {live.target ? `, target: ${live.target}` : ''}
      </p>

      <h2 style={{ fontSize: 20, margin: '24px 0 8px' }}>Sample cases</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th style={cell}>Editor enters</th>
            <th style={cell}>Visitor gets</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLES.map((sample) => (
            <tr key={sample || '(empty)'}>
              <td style={cell}>{sample || '(empty)'}</td>
              <td style={cell}>{resolve(sample).href ?? 'null (no link drawn)'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function ShowLinkTester({ initialShow }: { initialShow: string }) {
  const [show, setShow] = useState(initialShow);
  const [source, setSource] = useState<Source>('prop');
  // Bumped after a cookie change so the hook reads the cookie again.
  const [version, setVersion] = useState(0);

  const setCookie = (value: string | null) => {
    document.cookie = value
      ? `project_code=${encodeURIComponent(value)}; path=/`
      : 'project_code=; path=/; max-age=0';
    setVersion((v) => v + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label htmlFor="fake-show">Fake show code</label>
        <input
          id="fake-show"
          onChange={(e) => setShow(e.target.value)}
          style={{ ...box, width: 120 }}
          value={show}
        />
        <select onChange={(e) => setSource(e.target.value as Source)} style={box} value={source}>
          <option value="prop">Pass as prop</option>
          <option value="cookie">Cookie only (no prop)</option>
        </select>
        <button onClick={() => setCookie(show)} style={button} type="button">
          Set cookie
        </button>
        <button onClick={() => setCookie(null)} style={button} type="button">
          Clear cookie
        </button>
      </div>
      <p key={version} style={{ color: '#6b7280', marginTop: 8 }}>
        Cookie project_code: {getCookieValue('project_code') ?? '(not set)'}
      </p>

      <Results key={version} projectCode={source === 'prop' ? show : null} />
    </div>
  );
}
