export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const post: APIRoute = async ({ request }) => {
  const form = await request.formData();
  // honeypot to catch bots
  if (form.get('hp_field')) {
    return new Response(null, { status: 204 });
  }

  const name    = (form.get('name')    || '').toString().trim();
  const email   = (form.get('email')   || '').toString().trim();
  const message = (form.get('message') || '').toString().trim();

  if (!email || !message) {
    return new Response(
      JSON.stringify({ error: 'Email & message are required.' }),
      { status: 400 }
    );
  }

  // configure Gmail SMTP via Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.GMAIL_SMTP_USER,
      pass: process.env.GMAIL_SMTP_PASS, 
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.GMAIL_SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      subject: `New message from ${name || email}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error('Gmail send error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to send message.' }),
      { status: 500 }
    );
  }
};
