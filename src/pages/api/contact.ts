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
  const senderName = (import.meta.env.CONTACT_SENDER_NAME ?? 'Philip J. Rhea Website').toString().trim();

  if (!smtpUser || !smtpPass || !recipientEmail) {
    return null;
  }

  return { smtpUser, smtpPass, recipientEmail, senderName };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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
  const safeName = escapeHtml(name || 'Unknown');
  const safePhone = escapeHtml(phone || 'Not provided');
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  // basic validation
  if (!name || !email || !message) {
    return jsonResponse({ error: 'Name, email, and message are required.' }, 400);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return jsonResponse({ error: 'Please enter a valid email address.' }, 400);
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
    await transporter.sendMail({
      from: `"${config.senderName}" <${config.smtpUser}>`,
      to: config.recipientEmail,
      replyTo: email,
      subject: `New message from ${name || email}`,
      text: [
        'New website contact submission',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <div
  style="
    background-color: #f5f5f4;
    width: 100%;
    margin: 0;
    padding: 32px 16px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
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
      box-shadow: 0 20px 45px rgba(28, 25, 23, 0.15);
      border: 1px solid #e7e5e4;
    "
  >
    <p
      style="
        line-height: 1.2;
        text-align: left;
        font-size: 0.875rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
        color: #78716c;
        margin: 0 0 1rem;
      "
    >
      Website Contact
    </p>
    <p
      style="
        line-height: 1.2;
        text-align: left;
        font-size: 2rem;
        font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
        color: #1c1917;
        max-width: 600px;
        margin: 0 0 2rem;
      "
    >
      New message from ${safeName}
    </p>
    <p
      style="
        line-height: 2;
        text-align: justify;
        font-size: 1.0625rem;
        font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
        color: #44403c;
        max-width: 640px;
        margin: 0;
      "
    >
     ${safeMessage}
    </p>
    <hr
      style="
        width: 100%;
        margin-top: 2.5rem;
        margin-bottom: 2.5rem;
        border: none;
        border-top: 1px solid #d6d3d1;
      "
    />
    <table
  style="
    width: 100%;
    max-width: 700px;
    margin: auto;
    border-collapse: collapse;
    font-size: 1rem;
    font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
    color: #44403c;
  "
>
  <tbody>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Name:</td>
      <td style="padding: 0.5rem 0.5rem;">${safeName}</td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Email:</td>
      <td style="padding: 0.5rem 0.5rem;">
        <a href="mailto:${safeEmail}" style="color: #0f766e;">${safeEmail}</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Phone:</td>
      <td style="padding: 0.5rem 0.5rem;">${safePhone}</td>
    </tr>
  </tbody>
</table>
  </div>
</div>`,
    });

    return jsonResponse({ success: true, message: 'Message sent successfully.' }, 200);
  } catch (err: any) {
    console.error('Gmail send error:', err);
    return jsonResponse(
      { error: 'We could not send your message right now. Please try again shortly.' },
      502
    );
  }
};
