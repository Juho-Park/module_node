import { Resend } from 'resend';

export function send(to: string, subject: string, html: string) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not defined');
    if (!process.env.RESEND_FROM) throw new Error('RESEND_FROM is not defined');

    const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send({
        from: process.env.RESEND_FROM || '',
        to,
        subject,
        html
    });
}
