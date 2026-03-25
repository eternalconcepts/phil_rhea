// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getContactConfig() {
  const smtpUser = (import.meta.env.GMAIL_SMTP_USER ?? '').toString().trim();
  const smtpPass = (import.meta.env.GMAIL_SMTP_PASS ?? '').toString().trim();
  const recipientEmail = (import.meta.env.CONTACT_RECIPIENT_EMAIL ?? '').toString().trim();

  if (!smtpUser || !smtpPass || !recipientEmail) {
    return null;
  }

  return { smtpUser, smtpPass, recipientEmail };
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return jsonResponse({ error: 'Unsupported form submission.' }, 415);
  }

  const form = await request.formData();

  // honeypot to catch bots
  if (form.get('hp_field')) {
    return new Response(null, { status: 204 });
  }

  const name    = (form.get('name')    ?? '').toString().trim();
  const phone   = (form.get('phone')   ?? '').toString().trim();
  const email   = (form.get('email')   ?? '').toString().trim();
  const message = (form.get('message') ?? '').toString().trim();

  // basic validation
  if (!email || !message) {
    return jsonResponse({ error: 'Email and message are required.' }, 400);
  }

  const config = getContactConfig();

  if (!config) {
    console.error('Contact form is missing SMTP configuration.');
    return jsonResponse(
      { error: 'The contact form is temporarily unavailable. Please try again later.' },
      503
    );
  }

  // configure Gmail SMTP via Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: `"Website Contact" <${config.smtpUser}>`,
      to: config.recipientEmail,
      replyTo: email,
      subject: `New message from ${name || email}`,
      html: `
        <div
  style="
    background-color: #f5f5f4;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
  "
>
  <div
    style="
      width: 91.666667%;
      max-width: 700px;
      margin: auto;
      background-color: #ffffff;
      padding: 3rem;
      border-radius: 0.75rem;
      box-shadow: 5px 10px 18px #888888;
      position: relative;
      margin-top: 3rem;
      margin-bottom: 3rem;
    "
  >
    <p
      style="
        line-height: 2;
        text-align: left;
        font-size: 2rem;
        font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
        color: #c3003c;
        max-width: 600px;
      "
    >
NEW MESSAGE FROM WEBSITE:    </p>    
    <p
      style="
        line-height: 2;
        text-align: justify;
        font-size: 1.25rem;
        font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
        color: #0c4a6e;
        max-width: 600px;
      "
    >
     ${message.replace(/\n/g, '<br>')}
    </p>
    <hr
      style="
        width: 83.333333%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 2.5rem;
        margin-bottom: 2.5rem;
        border: none;
        border-top: 1px solid #c3003c;
      "
    />
    <table
  style="
    width: 100%;
    max-width: 700px;
    margin: auto;
    border-collapse: collapse;
    font-size: 1.25rem;
    font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
    color: #0c4a6e;
  "
>
  <tbody>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Name:</td>
      <td style="padding: 0.5rem 0.5rem;">${name || '—'}</td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Email:</td>
      <td style="padding: 0.5rem 0.5rem;">
        <a href="mailto:${email}">${email}</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Phone:</td>
      <td style="padding: 0.5rem 0.5rem;">${phone || '—'}</td>
    </tr>
  </tbody>
</table>
  </div>
</div>`,
    });

    return jsonResponse({ success: true }, 200);
  } catch (err: any) {
    console.error('Gmail send error:', err);
    return jsonResponse(
      { error: 'We could not send your message right now. Please try again shortly.' },
      502
    );
  }
};
