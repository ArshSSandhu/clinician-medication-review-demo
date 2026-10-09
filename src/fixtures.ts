import { validateFixtures, type Patient } from './model.ts';

export const patients: readonly Patient[] = [
  {
    id: 'demo-01', name: 'Mina Brooks', scenario: 'Recorded medications · incomplete allergy details',
    medications: {
      state: 'recorded', source: 'Fictional intake record', reviewedOn: '2026-09-18',
      entries: [
        { id: 'm1', name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', status: 'active' },
        { id: 'm2', name: 'Metformin', dose: '500 mg', frequency: null, status: 'active' },
        { id: 'm3', name: 'Ibuprofen', dose: '200 mg', frequency: 'As needed', status: 'discontinued', discontinuedOn: null },
      ],
    },
    allergies: {
      state: 'known', source: 'Fictional intake record', reviewedOn: '2026-09-18',
      entries: [{ id: 'a1', substance: 'Penicillin', reaction: 'Rash', severity: null }],
    },
    priorVisit: { date: '2026-09-18', source: 'Fictional visit note', summary: 'Medication names were recorded during intake. Metformin frequency and the ibuprofen discontinuation date were not captured. A penicillin-associated rash was reported; severity was not recorded.' },
    tasks: [
      { id: 't1', text: 'Confirm the reported current medication list during the visit.' },
      { id: 't2', text: 'Ask about the missing metformin frequency.' },
      { id: 't3', text: 'Clarify the recorded penicillin reaction details.' },
    ],
  },
  {
    id: 'demo-02', name: 'Rowan Ellis', scenario: 'Explicit negative histories',
    medications: { state: 'explicitly-none-reported', source: 'Fictional intake statement', reviewedOn: '2026-09-25' },
    allergies: { state: 'no-known-allergies', source: 'Fictional intake statement', reviewedOn: '2026-09-25' },
    priorVisit: { date: '2026-09-25', source: 'Fictional visit note', summary: 'The fictional intake explicitly recorded no medications reported and no known allergies. These statements describe that intake and have not been confirmed for the upcoming visit.' },
    tasks: [{ id: 't1', text: 'Confirm whether the reported histories have changed since intake.' }],
  },
  {
    id: 'demo-03', name: 'Avery Lane', scenario: 'Uncertain medication status · unknown allergies',
    medications: {
      state: 'recorded', source: 'Fictional transferred list', reviewedOn: null,
      entries: [{ id: 'm1', name: 'Levothyroxine', dose: null, frequency: 'Once daily', status: 'unknown' }],
    },
    allergies: { state: 'unknown', reason: 'Allergy history was not captured in the fictional transferred record.', source: 'Fictional transferred record', reviewedOn: null },
    priorVisit: null,
    tasks: [
      { id: 't1', text: 'Ask whether the listed medication is currently taken and record its dose.' },
      { id: 't2', text: 'Obtain and document the allergy history.' },
      { id: 't3', text: 'Ask whether a prior visit summary is available.' },
    ],
  },
  {
    id: 'demo-04', name: 'Jules Morgan', scenario: 'Unknown medication history · incomplete allergy record',
    medications: { state: 'unknown', reason: 'No medication history was captured in this fictional intake.', source: 'Fictional intake record', reviewedOn: null },
    allergies: { state: 'known', source: 'Fictional intake record', reviewedOn: '2026-09-30', entries: [{ id: 'a1', substance: 'Latex', reaction: null, severity: null }] },
    priorVisit: null,
    tasks: [
      { id: 't1', text: 'Obtain and document the medication history.' },
      { id: 't2', text: 'Clarify the recorded latex allergy details.' },
    ],
  },
];

validateFixtures(patients);
