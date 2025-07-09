export async function GET() {
  const token = import.meta.env.CALENDLY_TOKEN;
  const user  = import.meta.env.CALENDLY_USER_URI;

  console.log('Calendly token:', token?.slice(0,8) + '…');
  console.log('Calendly user URI:', user);

  const res = await fetch(
    `https://api.calendly.com/event_types?user=${encodeURIComponent(user)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const body = await res.text();
  return new Response(body, {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
