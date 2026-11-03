import nodemailer from 'nodemailer';
import { CONTACT_EMAIL } from '../src/content/site';
import type { BriefingFields } from '../src/sections/Contact/briefing';
import { renderBriefing } from './email/render';

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS, MAIL_FROM = SMTP_USER } = process.env;

const transport = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_PORT === '465',
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null;

export const mailConfigured = !!(transport && MAIL_FROM);

/** Emails a briefing request to the SMARTSS inbox; replying goes straight to the visitor. */
export async function sendBriefing(f: BriefingFields) {
  if (!transport || !MAIL_FROM) throw new Error('SMTP is not configured (set SMTP_HOST and MAIL_FROM or SMTP_USER).');
  await transport.sendMail({ from: MAIL_FROM, to: CONTACT_EMAIL, replyTo: { name: f.name.replace(/\s+/g, ' '), address: f.email.trim() }, ...renderBriefing(f) });
}
