import nodemailer from 'nodemailer';
import { CONTACT_EMAIL } from '../src/content/site';
import type { BriefingFields } from '../src/sections/Contact/briefing';
import { renderBriefing } from './email/render';

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_ADDRESS = SMTP_USERNAME, SMTP_FROM_NAME = 'SMARTSS website', SMTP_USE_SSL } = process.env;

const port = Number(SMTP_PORT);
const useTls = /^(true|1|yes)$/i.test(SMTP_USE_SSL ?? '');

export const transport = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      // 465 is TLS from the first byte; other ports upgrade with STARTTLS, which SMTP_USE_SSL makes mandatory.
      secure: port === 465,
      requireTLS: useTls && port !== 465,
      auth: SMTP_USERNAME ? { user: SMTP_USERNAME, pass: SMTP_PASSWORD } : undefined,
    })
  : null;

export const mailConfigured = !!(transport && SMTP_FROM_ADDRESS);

/** Emails a briefing request to the SMARTSS inbox; replying goes straight to the visitor. */
export async function sendBriefing(f: BriefingFields) {
  if (!transport || !SMTP_FROM_ADDRESS) throw new Error('SMTP is not configured (set SMTP_HOST and SMTP_FROM_ADDRESS or SMTP_USERNAME).');
  await transport.sendMail({
    from: { name: SMTP_FROM_NAME, address: SMTP_FROM_ADDRESS },
    to: CONTACT_EMAIL,
    replyTo: { name: f.name.replace(/\s+/g, ' '), address: f.email.trim() },
    ...renderBriefing(f),
  });
}
