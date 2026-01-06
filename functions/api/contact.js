export async function onRequest({ request, env }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  // Your HTML form submits as form-data or urlencoded, so use formData()
  const form = await request.formData();

  // Read fields
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const company = String(form.get("company") || "").trim();
  const service = String(form.get("service") || "").trim();
  const message = String(form.get("message") || "").trim();

  // Honeypot (optional but recommended)
  const website = String(form.get("website") || "").trim();
  if (website) {
    return Response.redirect("/contact?sent=1", 303);
  }

  if (message.length < 5) {
    return Response.redirect("/contact?error=1", 303);
  }

  const subject = `Thinkage website contact${service ? ` — ${service}` : ""}`;
  const text = `Name: ${name || "—"}
Email: ${email || "—"}
Company: ${company || "—"}
Service: ${service || "—"}

Message:
${message}
`;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,     // e.g. "Thinkage <contact@thinkage.org>"
      to: [env.TO_EMAIL],       // e.g. "info@thinkage.org"
      subject,
      text,
      reply_to: email || undefined,
    }),
  });

  if (!resp.ok) {
    // Optional: log details to Cloudflare function logs
    const err = await resp.text();
    console.log("Resend error:", err);
    return Response.redirect("/contact?error=1", 303);
  }

  // This is why your URL becomes ?sent=1
  return Response.redirect("/contact?sent=1", 303);
}
