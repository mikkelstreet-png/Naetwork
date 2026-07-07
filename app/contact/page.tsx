'use client';

import { Check, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const EMPTY_FORM = { name: '', email: '', subject: 'booking', message: '', website: '' };

export default function ContactPage() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const subjects = [
    ['booking', isDa ? 'Booking og session' : 'Booking and session'],
    ['account', isDa ? 'Konto og profil' : 'Account and profile'],
    ['professional', isDa ? 'Professionel på Naetwork' : 'Professional on Naetwork'],
    ['privacy', isDa ? 'Privatliv og data' : 'Privacy and data'],
    ['other', isDa ? 'Andet' : 'Other'],
  ];

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (isDa ? 'Beskeden kunne ikke sendes.' : 'The message could not be sent.'));
      setStatus('sent');
      setForm(EMPTY_FORM);
    } catch (submitError) {
      setStatus('idle');
      setError(submitError instanceof Error ? submitError.message : (isDa ? 'Beskeden kunne ikke sendes.' : 'The message could not be sent.'));
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-8 sm:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Kontakt' : 'Contact'}</p>
          <h1 className="max-w-4xl text-4xl font-black leading-none text-gray-950 text-balance sm:text-5xl md:text-7xl">
            {isDa ? 'Hvordan kan vi hjælpe?' : 'How can we help?'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            {isDa ? 'Skriv kort, hvad din henvendelse handler om. Vi vender tilbage så hurtigt som muligt.' : 'Tell us briefly what your request is about. We will get back to you as soon as possible.'}
          </p>
        </div>
      </section>

      <section className="px-5 py-7 sm:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
          <div className="border border-gray-200 bg-white p-5 sm:p-7">
            {status === 'sent' ? (
              <div role="status" className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-950 text-white"><Check size={24} aria-hidden="true" /></span>
                <h2 className="mt-6 text-3xl font-black text-gray-950">{isDa ? 'Tak for din besked.' : 'Thank you for your message.'}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">{isDa ? 'Den er gemt hos os, og vi vender tilbage på den e-mail, du har angivet.' : 'It has been saved, and we will reply to the email address you provided.'}</p>
                <button type="button" onClick={() => setStatus('idle')} className="mt-7 rounded-lg border border-gray-300 px-5 py-3 text-sm font-black text-gray-950 hover:border-gray-950">
                  {isDa ? 'Send en ny besked' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" aria-busy={status === 'sending'}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-black text-gray-950">{isDa ? 'Navn' : 'Name'}</label>
                    <input id="contact-name" autoComplete="name" required minLength={2} maxLength={100} value={form.name} onChange={(event) => update('name', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-black text-gray-950">E-mail</label>
                    <input id="contact-email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(event) => update('email', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950" />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-black text-gray-950">{isDa ? 'Emne' : 'Subject'}</label>
                  <select id="contact-subject" value={form.subject} onChange={(event) => update('subject', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950">
                    {subjects.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>

                <input name="website" className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} />

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label htmlFor="contact-message" className="text-sm font-black text-gray-950">{isDa ? 'Besked' : 'Message'}</label>
                    <span className="text-xs text-gray-400">{form.message.length}/2000</span>
                  </div>
                  <textarea id="contact-message" required minLength={20} maxLength={2000} rows={8} value={form.message} onChange={(event) => update('message', event.target.value)} className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder={isDa ? 'Beskriv kort, hvad du har brug for hjælp til.' : 'Briefly describe what you need help with.'} />
                </div>

                {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <button type="submit" disabled={status === 'sending'} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60">
                  {status === 'sending' ? (isDa ? 'Sender...' : 'Sending...') : (isDa ? 'Send besked' : 'Send message')}
                  {status !== 'sending' && <Send size={16} aria-hidden="true" />}
                </button>
                <p className="text-xs leading-relaxed text-gray-400">{isDa ? 'Vi behandler oplysningerne for at besvare din henvendelse. Læs om opbevaring og dine rettigheder i ' : 'We process the information to respond to your request. Read about retention and your rights in our '}<Link href="/privacy" className="font-semibold text-gray-600 underline underline-offset-2">{isDa ? 'privatlivspolitikken' : 'privacy policy'}</Link>.</p>
              </form>
            )}
          </div>

          <aside className="h-fit border-t border-gray-300 pt-6 lg:sticky lg:top-24">
            <Mail size={20} aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-black text-gray-950">{isDa ? 'Direkte kontakt' : 'Direct contact'}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{isDa ? 'Du kan også skrive direkte til os. Undlad følsomme personoplysninger i almindelig e-mail.' : 'You can also email us directly. Avoid sensitive personal information in regular email.'}</p>
            <a href="mailto:kontakt@naetwork.dk" className="mt-5 inline-flex text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">kontakt@naetwork.dk</a>
            <div className="mt-8 border-y border-gray-200 py-5">
              <p className="text-xs font-black uppercase text-gray-400">{isDa ? 'Privatliv' : 'Privacy'}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{isDa ? 'Kontaktbeskeder bruges kun til at håndtere din henvendelse og administreres af Naetwork.' : 'Contact messages are only used to handle your request and are managed by Naetwork.'}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
