import test from 'node:test';
import assert from 'node:assert/strict';
import { missingInformation, validateFixtures, displayDate } from '../src/model.ts';
import { patients } from '../src/fixtures.ts';

test('known allergy history cannot use an empty array as a negative', () => {
  const patient = { ...patients[0], allergies: { ...patients[0].allergies, entries: [] } };
  assert.throws(() => validateFixtures([patient]), /must have entries/);
});

test('empty recorded medication history is also rejected', () => {
  const patient = { ...patients[0], medications: { ...patients[0].medications, entries: [] } };
  assert.throws(() => validateFixtures([patient]), /must have entries/);
});

test('explicit negatives are distinct from unknown histories', () => {
  assert.equal(patients[1].allergies.state, 'no-known-allergies');
  assert.equal(patients[1].medications.state, 'explicitly-none-reported');
  assert.equal('entries' in patients[1].allergies, false);
  assert.equal('entries' in patients[1].medications, false);
  assert.deepEqual(missingInformation(patients[1]), []);
  assert.ok(missingInformation(patients[2]).includes('Allergy status is unknown.'));
  assert.ok(missingInformation(patients[3]).includes('Medication history is unknown.'));
});

test('missing details do not erase known allergies or infer medication status', () => {
  const missing = missingInformation(patients[0]);
  assert.ok(missing.includes('Penicillin: severity is not recorded.'));
  assert.ok(missing.includes('Metformin: frequency is not recorded.'));
  assert.equal(patients[0].allergies.state, 'known');
  assert.equal(patients[2].medications.entries[0].status, 'unknown');
  assert.ok(missingInformation(patients[2]).includes('Levothyroxine: status is unknown.'));
});

test('discontinued medication retains its recorded details and missing date', () => {
  const medication = patients[0].medications.entries.find(item => item.status === 'discontinued');
  assert.equal(medication.name, 'Ibuprofen');
  assert.equal(medication.dose, '200 mg');
  assert.equal(medication.discontinuedOn, null);
  assert.ok(missingInformation(patients[0]).includes('Ibuprofen: discontinuation date is not recorded.'));
});

test('missing review and prior visit are not inferred from other dates', () => {
  const missing = missingInformation(patients[2]);
  assert.ok(missing.includes('Medication review date is not recorded.'));
  assert.ok(missing.includes('Allergy review date is not recorded.'));
  assert.ok(missing.includes('Prior visit summary is unavailable.'));
});

test('calendar date display does not shift with timezone', () => {
  assert.equal(displayDate('2026-09-18'), '09/18/2026');
});

test('fixtures have unique patient IDs and entry IDs', () => {
  validateFixtures(patients);
  assert.throws(() => validateFixtures([patients[0], patients[0]]), /Duplicate patient ID/);
});
