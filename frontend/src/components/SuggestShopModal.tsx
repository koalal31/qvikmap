import { useState, useEffect } from 'react';
import { submitShop } from '../api/submissions';
import type { SubmissionForm } from '../types/submission';

const SHOP_TYPES = ['BAKERY', 'RESTAURANT', 'CAFE', 'PHARMACY', 'GROCERY'];

const EMPTY: SubmissionForm = {
  name: '', type: '', address: '', city: '', website: '', note: '', qvikVerified: false,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Props {
  onClose: () => void;
}

export function SuggestShopModal({ onClose }: Props) {
  const [form, setForm] = useState<SubmissionForm>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Generic field setter for text/select/textarea; checkbox handled separately below
  function field(key: keyof SubmissionForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitShop(form);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  }

  return (
    // Backdrop — clicking it closes the modal
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      {/* Card — stop propagation so clicking inside doesn't close */}
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'success' ? (
          <div className="py-4 text-center">
            <p className="text-3xl font-bold text-green-600">✓</p>
            <h2 className="mt-2 text-lg font-bold">Thank you!</h2>
            <p className="mt-1 text-sm text-gray-600">We will review your suggestion soon.</p>
            <button
              onClick={onClose}
              className="mt-4 rounded bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Suggest a shop</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-xl leading-none text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="font-medium">
                  Shop name <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={field('name')}
                  placeholder="e.g. CBA Budapest"
                  className="rounded border border-gray-300 px-2 py-1.5"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-medium">Type</span>
                <select
                  value={form.type}
                  onChange={field('type')}
                  className="rounded border border-gray-300 px-2 py-1.5"
                >
                  <option value="">Select…</option>
                  {SHOP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-medium">Address</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={field('address')}
                  placeholder="Street and number"
                  className="rounded border border-gray-300 px-2 py-1.5"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-medium">
                  City <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={field('city')}
                  placeholder="e.g. Budapest"
                  className="rounded border border-gray-300 px-2 py-1.5"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-medium">Website</span>
                <input
                  type="url"
                  value={form.website}
                  onChange={field('website')}
                  placeholder="https://…"
                  className="rounded border border-gray-300 px-2 py-1.5"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-medium">Note</span>
                <textarea
                  value={form.note}
                  onChange={field('note')}
                  rows={2}
                  placeholder="Anything else we should know?"
                  className="resize-none rounded border border-gray-300 px-2 py-1.5"
                />
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.qvikVerified}
                  onChange={(e) => setForm((f) => ({ ...f, qvikVerified: e.target.checked }))}
                />
                <span>I have paid with qvik here</span>
              </label>

              {status === 'error' && <p className="text-red-500">{errorMsg}</p>}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex-1 rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Sending…' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded border border-gray-300 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
