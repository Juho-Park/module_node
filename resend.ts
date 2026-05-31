import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_FROM) throw new Error('RESEND_FROM is not defined');
  return resend.emails.send({
    from: process.env.RESEND_FROM || '',
    to,
    subject,
    html
  });
}
