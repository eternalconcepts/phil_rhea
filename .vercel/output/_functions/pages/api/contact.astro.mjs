import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const form = await request.formData();
  if (form.get("hp_field")) {
    return new Response(null, { status: 204 });
  }
  const name = (form.get("name") ?? "").toString().trim();
  const phone = (form.get("phone") ?? "").toString().trim();
  const email = (form.get("email") ?? "").toString().trim();
  const message = (form.get("message") ?? "").toString().trim();
  if (!email || !message) {
    return new Response(
      JSON.stringify({ error: "Email & message are required." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // SSL
    auth: {
      user: "eternalconceptsfl@gmail.com",
      pass: "hebh kvtt yheq vwaz"
    }
  });
  try {
    await transporter.sendMail({
      from: `"Website Contact" <${"eternalconceptsfl@gmail.com"}>`,
      to: "eternalconceptsfl@gmail.com",
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
     ${message.replace(/\n/g, "<br>")}
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
      <td style="padding: 0.5rem 0.5rem;">${name || "—"}</td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Email:</td>
      <td style="padding: 0.5rem 0.5rem;">
        <a href="mailto:${email}">${email}</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 0.5rem 0.5rem;">Sender Phone:</td>
      <td style="padding: 0.5rem 0.5rem;">${phone || "—"}</td>
    </tr>
  </tbody>
</table>
  </div>
</div>`
    });
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Gmail send error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send message." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
