export async function onRequestPost({ request }) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const company = formData.get("company");
  const service = formData.get("service");
  const message = formData.get("message");

  const body = `
New Thinkage Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Service: ${service || "N/A"}

Message:
${message}
`;

  await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [
        { to: [{ email: "hello@thinkage.org" }] }
      ],
      from: {
        email: "hello@thinkage.org",
        name: "Thinkage Website"
      },
      subject: "New Contact Form Submission",
      content: [{ type: "text/plain", value: body }]
    })
  });

  return new Response("OK", { status: 200 });
}
