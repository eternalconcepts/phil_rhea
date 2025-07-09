// src/pages/api/calendly/availability.ts

export async function GET({ request }: { request: Request }) {
  const token     = import.meta.env.CALENDLY_TOKEN;
  const eventType = new URL(request.url).searchParams.get('event_type');
  const start     = new URL(request.url).searchParams.get('start');
  const end       = new URL(request.url).searchParams.get('end');

  if (!eventType || !start || !end) {
    return new Response(
      JSON.stringify({ error: 'Missing event_type, start or end query params' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const calendlyRes = await fetch(
    `https://api.calendly.com/availability_schedules?` +
      `event_type=${encodeURIComponent(eventType)}` +
      `&date_start=${encodeURIComponent(start)}` +
      `&date_end=${encodeURIComponent(end)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!calendlyRes.ok) {
    const errBody = await calendlyRes.text();
    return new Response(errBody, {
      status: calendlyRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await calendlyRes.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
