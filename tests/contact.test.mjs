import assert from 'node:assert/strict';
import { after, before, beforeEach, mock, test } from 'node:test';
import nodemailer from 'nodemailer';
import { createServer } from 'vite';

const envNames = ['GMAIL_SMTP_USER', 'GMAIL_SMTP_PASS', 'CONTACT_RECIPIENT_EMAIL', 'CONTACT_SENDER_NAME'];
const previousEnv = new Map(envNames.map((name) => [name, process.env[name]]));
let server;
let post;
let smtp;
let mail;

before(async () => {
  // Do not load credentials or open real SMTP connections in tests.
  server = await createServer({
    configFile: false,
    envDir: false,
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  post = (await server.ssrLoadModule('/src/pages/api/contact.ts')).POST;
});

beforeEach(() => {
  mock.restoreAll();
  process.env.GMAIL_SMTP_USER = 'site@example.com';
  process.env.GMAIL_SMTP_PASS = 'test-password';
  process.env.CONTACT_RECIPIENT_EMAIL = 'architect@example.com';
  process.env.CONTACT_SENDER_NAME = 'Philip J. Rhea Website';
  mail = mock.fn(async () => ({ accepted: ['architect@example.com'] }));
  smtp = mock.method(nodemailer, 'createTransport', () => ({ sendMail: mail }));
  mock.method(console, 'error', () => {});
});

after(async () => {
  mock.restoreAll();
  await server?.close();
  for (const [name, value] of previousEnv) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

function submit(overrides = {}, duplicateHoneypot) {
  const form = new FormData();
  const fields = {
    _cp: '', name: 'A Visitor', email: 'visitor@example.net', phone: '555-0100',
    message: 'Please discuss my project.', ...overrides,
  };
  for (const [name, value] of Object.entries(fields)) {
    if (value !== null) form.set(name, value);
  }
  if (duplicateHoneypot !== undefined) form.append('_cp', duplicateHoneypot);
  return post({ request: new Request('https://example.com/api/contact', { method: 'POST', body: form }) });
}

test('filled honeypot rejects a direct POST before SMTP', async () => {
  const response = await submit({ _cp: 'spam' });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).success, undefined);
  assert.equal(smtp.mock.callCount(), 0);
});

test('even whitespace in the honeypot blocks sending', async () => {
  assert.equal((await submit({ _cp: ' ' })).status, 403);
  assert.equal(smtp.mock.callCount(), 0);
});

test('missing honeypot cannot bypass the check', async () => {
  assert.equal((await submit({ _cp: null })).status, 400);
  assert.equal(smtp.mock.callCount(), 0);
});

test('a filled duplicate honeypot is rejected in either order', async () => {
  assert.equal((await submit({}, 'spam')).status, 403);
  assert.equal((await submit({ _cp: 'spam' }, '')).status, 403);
  assert.equal(smtp.mock.callCount(), 0);
});

test('duplicate empty honeypots are rejected', async () => {
  assert.equal((await submit({}, '')).status, 400);
  assert.equal(smtp.mock.callCount(), 0);
});

test('file submitted as honeypot is rejected', async () => {
  assert.equal((await submit({ _cp: new Blob(['spam']) })).status, 403);
  assert.equal(smtp.mock.callCount(), 0);
});

test('all required fields must have content, including telephone', async () => {
  for (const field of ['name', 'email', 'phone', 'message']) {
    assert.equal((await submit({ [field]: '   ' })).status, 400, field);
  }
  assert.equal(smtp.mock.callCount(), 0);
});

test('invalid email is rejected before SMTP', async () => {
  assert.equal((await submit({ email: 'not-an-email' })).status, 400);
  assert.equal(smtp.mock.callCount(), 0);
});

test('oversized fields are rejected before SMTP', async () => {
  for (const [field, length] of [['name', 121], ['email', 255], ['phone', 51], ['message', 5001]]) {
    assert.equal((await submit({ [field]: 'x'.repeat(length) })).status, 400, field);
  }
  assert.equal(smtp.mock.callCount(), 0);
});

test('malformed form body returns a controlled error', async () => {
  const response = await post({ request: new Request('https://example.com/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'multipart/form-data' }, body: 'bad-body',
  }) });
  assert.equal(response.status, 400);
  assert.equal(smtp.mock.callCount(), 0);
});

test('empty honeypot and valid fields send to the configured inbox with visitor Reply-To', async () => {
  const response = await submit();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(mail.mock.callCount(), 1);
  const [message] = mail.mock.calls[0].arguments;
  assert.equal(message.to, 'architect@example.com');
  assert.equal(message.replyTo, 'visitor@example.net');
  assert.equal(message.from, '"Philip J. Rhea Website" <site@example.com>');
  assert.ok(!message.text.includes('_cp'));
});

test('missing SMTP configuration returns an unavailable error', async () => {
  process.env.GMAIL_SMTP_PASS = '';
  assert.equal((await submit()).status, 503);
  assert.equal(smtp.mock.callCount(), 0);
});

test('SMTP failure returns an error without reporting success', async () => {
  mail.mock.mockImplementation(async () => { throw new Error('SMTP unavailable'); });
  const response = await submit();
  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, undefined);
  assert.equal(mail.mock.callCount(), 1);
});
