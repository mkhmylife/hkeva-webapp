'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {unstable_rethrow} from 'next/navigation';
import {submitFpsReference} from '@/libs/invoice';
import {FPS_REFERENCE_TYPES, isFpsPending, isValidFpsReference} from '@/libs/fps-payment';
import type {InvoiceDto} from '@/types/invoiceDto';

type Props = {
  invoice: InvoiceDto;
  details: {id: string; accountName?: string};
  disabled: boolean;
  onSubmitted: (invoice: InvoiceDto) => void;
  onBusyChange: (busy: boolean) => void;
};

export default function FpsPayment({invoice, details, disabled, onSubmitted, onBusyChange}: Props) {
  const t = useTranslations('FpsPayment');
  const locale = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isFpsPending(invoice)) {
    return (
      <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4" aria-label={t('title')}>
        <p role="status" className="font-semibold text-amber-900">{t('pending-title')}</p>
        <p className="mt-2 text-sm text-amber-900">{t('pending-description')}</p>
        <a href={`/${locale}/profile/payments/${invoice.id}/fps-reference`} className="mt-3 block break-all text-sm font-medium text-primary underline">
          {t('view-reference')}{invoice.fpsReferenceFilename ? ` (${invoice.fpsReferenceFilename})` : ''}
        </a>
      </section>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    if (!file || !isValidFpsReference(file)) {
      setError(t('invalid-file'));
      return;
    }
    setError(null);
    onBusyChange(true);
    try {
      const data = new FormData();
      data.set('file', file);
      const result = await submitFpsReference(invoice.id, data);
      if (result.error) setError(t(result.error));
      else onSubmitted(result.invoice);
    } catch (error) {
      unstable_rethrow(error);
      setError(t('upload-failed'));
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 rounded-xl border border-brand-neutral-200 p-4">
      <div>
        <h2 className="font-semibold">{t('title')}</h2>
        <p className="mt-2 text-sm text-brand-neutral-500">{t('instructions', {amount: invoice.due.toLocaleString()})}</p>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2"><dt>{t('fps-id')}</dt><dd className="break-all font-semibold select-all">{details.id}</dd></div>
          {details.accountName ? (
            <div className="flex gap-2"><dt>{t('account-name')}</dt><dd className="font-semibold">{details.accountName}</dd></div>
          ) : null}
        </dl>
        {!details.accountName ? <p className="mt-2 text-sm text-brand-neutral-500">{t('confirm-account-name')}</p> : null}
      </div>
      <div>
        <label htmlFor="fps-reference" className="mb-2 block text-sm font-medium">{t('reference-label')}</label>
        <input
          id="fps-reference"
          name="file"
          type="file"
          accept={FPS_REFERENCE_TYPES.join(',')}
          required
          disabled={disabled}
          aria-describedby="fps-reference-help fps-reference-error"
          onChange={event => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
            setError(selected && !isValidFpsReference(selected) ? t('invalid-file') : null);
          }}
          className="block w-full rounded-lg border border-brand-neutral-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-2 disabled:opacity-50"
        />
        <p id="fps-reference-help" className="mt-2 text-xs text-brand-neutral-500">{t('file-help')}</p>
      </div>
      <p className="text-sm text-brand-neutral-500">{t('review-notice')}</p>
      <p id="fps-reference-error" role="alert" className="text-sm text-red-600">{error}</p>
      <button type="submit" disabled={disabled || !file || !isValidFpsReference(file)} className="w-full rounded-xl bg-brand-500 px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">
        {t('submit')}
      </button>
    </form>
  );
}
