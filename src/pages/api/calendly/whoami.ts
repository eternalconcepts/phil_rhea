// src/pages/api/calendly/whoami.ts
export async function GET() {
    const token = import.meta.env.CALENDLY_TOKEN;
    const res = await fetch("https://api.calendly.com/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    // data.resource.scheduling_url is the user landing page
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // src/pages/api/calendly/event-types.ts
  export async function GET() {
    const token = import.meta.env.CALENDLY_TOKEN;
    const user  = import.meta.env.CALENDLY_USER_URI;  // or ORG URI
    const res = await fetch(
      `https://api.calendly.com/event_types?user=${encodeURIComponent(user)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    // data.collection[i].attributes.scheduling_url is the event‐type page
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  