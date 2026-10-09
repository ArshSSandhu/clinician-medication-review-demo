import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { patients } from '../src/fixtures.ts';
import { missingInformation } from '../src/model.ts';
import { toggleTaskCompletion } from '../src/checklist.ts';

register('./tsx-loader.mjs', import.meta.url);
const { Medications, Allergies } = await import('../src/App.tsx');
const render = (Component, history) => renderToStaticMarkup(createElement(Component, { history }));
const rowFor = (html, name) => {
  const row = html.match(/<tr>[\s\S]*?<\/tr>/g)?.find(row => row.includes(name));
  assert.ok(row, `Expected a rendered row for ${name}`);
  return row;
};

test('rendered unknown allergy status stays distinct from known allergies and explicit negatives', () => {
  const unknown = render(Allergies, patients[2].allergies);
  const known = render(Allergies, patients[0].allergies);
  const negative = render(Allergies, patients[1].allergies);
  assert.match(unknown, /<h3>Allergy status unknown<\/h3>/);
  assert.match(unknown, /Allergy history was not captured/);
  assert.doesNotMatch(unknown, /No known allergies|Penicillin|Known allergies/);
  assert.match(known, /Known allergies/);
  assert.match(known, /<h3>Penicillin<\/h3>/);
  assert.match(known, /<dd>Rash<\/dd>/);
  assert.doesNotMatch(known, /Allergy status unknown|No known allergies/);
  assert.match(negative, /<h3>No known allergies<\/h3>/);
  assert.match(negative, /Explicitly recorded at intake/);
  assert.doesNotMatch(negative, /Allergy status unknown|Penicillin/);
});

test('missing medication dose and frequency render explicit unknown values without defaults', () => {
  const doseRow = rowFor(render(Medications, patients[2].medications), 'Levothyroxine');
  assert.match(doseRow, /<td class="missing-value">Not recorded<\/td><td class="">Once daily<\/td>/);
  assert.match(doseRow, />Status unknown<\/span>/);
  assert.ok(missingInformation(patients[2]).includes('Levothyroxine: dose is not recorded.'));
  const frequencyRow = rowFor(render(Medications, patients[0].medications), 'Metformin');
  assert.match(frequencyRow, /<td class="">500 mg<\/td><td class="missing-value">Not recorded<\/td>/);
  assert.match(frequencyRow, />Active<\/span>/);
  assert.ok(missingInformation(patients[0]).includes('Metformin: frequency is not recorded.'));
});

test('discontinued medication retains a textual status in its own rendered row', () => {
  const html = render(Medications, patients[0].medications);
  assert.match(html, /<h3>Discontinued medications /);
  const row = rowFor(html, 'Ibuprofen');
  assert.match(row, /<span class="badge discontinued">Discontinued<\/span>/);
  assert.match(row, /Discontinuation date not recorded/);
  assert.match(row, /<td class="">200 mg<\/td><td class="">As needed<\/td>/);
  assert.doesNotMatch(row, />Active<\/span>|>Status unknown<\/span>/);
});

test('toggling one follow-up task preserves another task and other patients', () => {
  const previous = Object.freeze({
    'demo-01': Object.freeze(['t2']),
    'demo-02': Object.freeze(['t1']),
  });
  const checked = toggleTaskCompletion(previous, 'demo-01', 't1');
  assert.deepEqual(checked['demo-01'], ['t2', 't1']);
  assert.deepEqual(checked['demo-02'], ['t1']);
  const unchecked = toggleTaskCompletion(checked, 'demo-01', 't1');
  assert.deepEqual(unchecked['demo-01'], ['t2']);
  assert.deepEqual(unchecked['demo-02'], ['t1']);
  assert.deepEqual(previous['demo-01'], ['t2']);
  assert.deepEqual(checked['demo-01'], ['t2', 't1']);
  assert.deepEqual(toggleTaskCompletion({}, 'demo-03', 't1')['demo-03'], ['t1']);
});
