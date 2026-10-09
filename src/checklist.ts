export type ChecklistState = Record<string, readonly string[]>;

export function toggleTaskCompletion(
  previous: ChecklistState, patientId: string, taskId: string,
): ChecklistState {
  const current = previous[patientId] ?? [];
  return {
    ...previous,
    [patientId]: current.includes(taskId)
      ? current.filter(id => id !== taskId)
      : [...current, taskId],
  };
}
