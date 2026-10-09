export type NonEmpty<T> = readonly [T, ...T[]];
export type Review = { source: string | null; reviewedOn: string | null };
export type MedicationStatus = 'active' | 'discontinued' | 'unknown';
export type Medication = {
  id: string;
  name: string;
  dose: string | null;
  frequency: string | null;
} & (
  | { status: 'active' | 'unknown' }
  | { status: 'discontinued'; discontinuedOn: string | null }
);
export type MedicationHistory = Review & (
  | { state: 'recorded'; entries: NonEmpty<Medication> }
  | { state: 'explicitly-none-reported' }
  | { state: 'unknown'; reason: string | null }
);
export type Allergy = {
  id: string;
  substance: string;
  reaction: string | null;
  severity: string | null;
};
export type AllergyHistory = Review & (
  | { state: 'known'; entries: NonEmpty<Allergy> }
  | { state: 'no-known-allergies' }
  | { state: 'unknown'; reason: string | null }
);
export type Patient = {
  id: string;
  name: string;
  scenario: string;
  medications: MedicationHistory;
  allergies: AllergyHistory;
  priorVisit: { date: string; summary: string; source: string } | null;
  tasks: readonly { id: string; text: string }[];
};

// These checks complement nonempty tuple types, which disappear at runtime.
// An empty recorded history is invalid; it is never normalized to a negative.
export function validateFixtures(patients: readonly Patient[]): void {
  const patientIds = new Set<string>();
  for (const patient of patients) {
    if (patientIds.has(patient.id)) throw new Error('Duplicate patient ID');
    patientIds.add(patient.id);
    const histories = [patient.medications, patient.allergies];
    for (const history of histories) {
      if ('entries' in history) {
        if (!history.entries.length) throw new Error('Recorded histories must have entries');
        if (new Set(history.entries.map(entry => entry.id)).size !== history.entries.length) {
          throw new Error('Duplicate history entry ID');
        }
      }
    }
    if (new Set(patient.tasks.map(task => task.id)).size !== patient.tasks.length) {
      throw new Error('Duplicate task ID');
    }
  }
}

export const medicationStatusLabels: Record<MedicationStatus, string> = {
  active: 'Active', discontinued: 'Discontinued', unknown: 'Status unknown',
};

export function missingInformation(patient: Patient): string[] {
  const missing: string[] = [];
  if (patient.medications.state === 'unknown') missing.push('Medication history is unknown.');
  if (patient.medications.reviewedOn === null) missing.push('Medication review date is not recorded.');
  if (patient.medications.state === 'recorded') {
    for (const medication of patient.medications.entries) {
      if (medication.dose === null) missing.push(`${medication.name}: dose is not recorded.`);
      if (medication.frequency === null) missing.push(`${medication.name}: frequency is not recorded.`);
      if (medication.status === 'unknown') missing.push(`${medication.name}: status is unknown.`);
      if (medication.status === 'discontinued' && medication.discontinuedOn === null) {
        missing.push(`${medication.name}: discontinuation date is not recorded.`);
      }
    }
  }
  if (patient.allergies.state === 'unknown') missing.push('Allergy status is unknown.');
  if (patient.allergies.reviewedOn === null) missing.push('Allergy review date is not recorded.');
  if (patient.allergies.state === 'known') {
    for (const allergy of patient.allergies.entries) {
      if (allergy.reaction === null) missing.push(`${allergy.substance}: reaction is not recorded.`);
      if (allergy.severity === null) missing.push(`${allergy.substance}: severity is not recorded.`);
    }
  }
  if (patient.priorVisit === null) missing.push('Prior visit summary is unavailable.');
  return missing;
}

// Calendar strings are formatted without timezone conversion or freshness inference.
export function displayDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
}
