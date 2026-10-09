import { useState } from 'react';
import { patients } from './fixtures.ts';
import { displayDate, medicationStatusLabels, missingInformation, type MedicationHistory, type Review, type AllergyHistory, type MedicationStatus } from './model.ts';
import { toggleTaskCompletion } from './checklist.ts';

function ReviewContext({ history }: { history: Review }) {
  return <p className="context">{history.source ?? 'Source not recorded'}<br />
    {history.reviewedOn ? `Last recorded review: ${displayDate(history.reviewedOn)}` : 'Review date unknown'}
  </p>;
}

export function Medications({ history }: { history: MedicationHistory }) {
  const groups: readonly MedicationStatus[] = ['active', 'discontinued', 'unknown'];
  const recordedGroups = history.state === 'recorded'
    ? groups.map(status => ({ status, entries: history.entries.filter(medication => medication.status === status) }))
    : [];
  return <section className="panel" aria-labelledby="medications-title">
    <div className="section-heading"><h2 id="medications-title">Medications</h2><span className="eyebrow">Recorded history</span></div>
    <p className="section-note">Recorded active status does not confirm current use. This list may be incomplete.</p>
    {history.state === 'recorded' ? <>
      <p className="section-note">Zero recorded active entries does not establish that the patient takes no medications.</p>
      <ul className="medication-summary" aria-label="Recorded medication counts by status">
        {recordedGroups.map(({ status, entries }) => <li key={status}>
          {status === 'active' ? 'Recorded active' : medicationStatusLabels[status]}: <strong>{entries.length}</strong>
        </li>)}
      </ul>
      {recordedGroups.filter(group => group.entries.length > 0).map(({ status, entries }) => {
      return <div className={`medication-group ${status}`} key={status}>
        <h3>{status === 'active' ? 'Recorded active medications' : status === 'discontinued' ? 'Discontinued medications' : 'Medications with unknown status'} <span className="count">{entries.length}</span></h3>
        <div className="table-scroll" tabIndex={0} role="region" aria-label={`${medicationStatusLabels[status]} medication table; scroll horizontally if needed`}><table>
          <caption className="sr-only">{medicationStatusLabels[status]} medications</caption>
          <thead><tr><th scope="col">Medication</th><th scope="col">Dose</th><th scope="col">Frequency</th><th scope="col">Status</th></tr></thead>
          <tbody>{entries.map(medication => <tr key={medication.id}>
            <th scope="row">{medication.name}{medication.status === 'discontinued' && <small>{medication.discontinuedOn ? `Discontinued: ${displayDate(medication.discontinuedOn)}` : 'Discontinuation date not recorded'}</small>}</th>
            <td className={medication.dose === null ? 'missing-value' : ''}>{medication.dose ?? 'Not recorded'}</td>
            <td className={medication.frequency === null ? 'missing-value' : ''}>{medication.frequency ?? 'Not recorded'}</td>
            <td><span className={`badge ${status}`}>{medicationStatusLabels[status]}</span></td>
          </tr>)}</tbody>
        </table></div>
      </div>;
    })}</> : <div className="history-state">
      <h3>{history.state === 'explicitly-none-reported' ? 'No medications reported' : 'Medication history unknown'}</h3>
      <p>{history.state === 'explicitly-none-reported' ? 'Explicitly recorded at intake; current use has not been confirmed for this visit.' : history.reason ?? 'Medication history was not recorded.'}</p>
    </div>}
    <ReviewContext history={history} />
  </section>;
}

export function Allergies({ history }: { history: AllergyHistory }) {
  return <section className="panel" aria-labelledby="allergies-title">
    <div className="section-heading"><h2 id="allergies-title">Allergies</h2><span className="eyebrow">{history.state === 'known' ? 'Known allergies' : history.state === 'unknown' ? 'Unknown status' : 'Explicit negative'}</span></div>
    {history.state === 'known' ? <>
      <p className="section-note">Recorded allergies; completeness has not been established.</p>
      {history.entries.map(allergy => <div className="allergy-entry" key={allergy.id}>
        <h3>{allergy.substance}</h3>
        <dl><div><dt>Reaction</dt><dd>{allergy.reaction ?? 'Not recorded'}</dd></div><div><dt>Severity</dt><dd>{allergy.severity ?? 'Not recorded'}</dd></div></dl>
      </div>)}
    </> : <div className="history-state">
      <h3>{history.state === 'no-known-allergies' ? 'No known allergies' : 'Allergy status unknown'}</h3>
      <p>{history.state === 'no-known-allergies' ? 'Explicitly recorded at intake. Confirm whether this statement is still current.' : history.reason ?? 'Allergy history was not recorded.'}</p>
    </div>}
    <ReviewContext history={history} />
  </section>;
}

export default function App() {
  const [patientId, setPatientId] = useState(patients[0]!.id);
  const [completedByPatient, setCompletedByPatient] = useState<Record<string, readonly string[]>>({});
  const patient = patients.find(item => item.id === patientId)!;
  const missing = missingInformation(patient);
  const completed = completedByPatient[patient.id] ?? [];
  function toggleTask(taskId: string) {
    setCompletedByPatient(previous => toggleTaskCompletion(previous, patient.id, taskId));
  }
  return <>
    <a className="skip-link" href="#workspace">Skip to workspace</a>
    <div className="demo-notice"><strong>Demonstration only</strong><span>Fictional patient data · Not a clinical decision tool</span></div>
    <header className="app-header"><div className="brand-mark" aria-hidden="true">V</div><div><strong>Visit preparation</strong><p>Medication review workspace</p></div><span className="local-label">Local demonstration</span></header>
    <main id="workspace">
      <div className="page-heading"><div><p className="eyebrow">Prepare for the conversation</p><h1>Review before the visit</h1><p>See recorded histories, information gaps, and follow-up tasks in one place.</p></div>
        <div className="patient-select"><label htmlFor="patient">Fictional patient</label><select id="patient" value={patientId} onChange={event => setPatientId(event.target.value)}>{patients.map(item => <option key={item.id} value={item.id}>{item.name} ({item.id})</option>)}</select></div>
      </div>
      <div className="patient-heading"><div><h2>{patient.name}</h2><p>{patient.scenario}</p></div><span className="badge">Fictional fixture · {patient.id}</span></div>
      <div className="workspace-grid">
        <div className="column"><Medications history={patient.medications} />
          <section className="panel" aria-labelledby="prior-title"><h2 id="prior-title">Prior visit</h2>{patient.priorVisit ? <><p className="visit-date">{displayDate(patient.priorVisit.date)} <span>· {patient.priorVisit.source}</span></p><p>{patient.priorVisit.summary}</p></> : <p className="empty">Prior visit summary unavailable. No summary was provided in this fixture.</p>}</section>
        </div>
        <div className="column"><Allergies history={patient.allergies} />
          <section className="panel gaps" aria-labelledby="missing-title"><div className="section-heading"><h2 id="missing-title">Missing information</h2><span className="count">{missing.length}</span></div>
            {missing.length ? <ul>{missing.map(item => <li key={item}>{item}</li>)}</ul> : <p>No missing fields detected in this fixture. This does not establish a complete or current history.</p>}
          </section>
          <section className="panel" aria-labelledby="tasks-title"><div className="section-heading"><h2 id="tasks-title">Follow-up checklist</h2><span className="eyebrow" aria-live="polite">{completed.length} / {patient.tasks.length}</span></div>
            <ul className="checklist">{patient.tasks.map(task => <li key={`${patient.id}-${task.id}`}><label><input type="checkbox" checked={completed.includes(task.id)} onChange={() => toggleTask(task.id)} /><span>{task.text}</span></label></li>)}</ul>
            <p className="section-note">Checks track preparation only; they do not verify or change histories. Kept per patient until this page reloads.</p>
          </section>
        </div>
      </div>
      <footer>All names and records are fictional. No prescribing recommendations are provided.</footer>
    </main>
  </>;
}

