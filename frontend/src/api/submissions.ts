import type { SubmissionForm } from '../types/submission';

export async function submitShop(data: SubmissionForm): Promise<void> {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}
