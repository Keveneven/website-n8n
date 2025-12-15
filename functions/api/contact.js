export async function onRequestPost(context) {
  const { env, request } = context;

  const form = await request.formData();
  const name = (form.get("name") || "").toString();
  const email = (form.get("email") || "").toString();
  const message = (form.get("message") || "").toString();

  const subject = `New contact form submission from ${name || "Unknown"}`;
  const body =
`Name: ${name}
Email: ${email}

Message:
${message}
`;

  await env.CONTACT_SEND.send({
    to: env.CONTACT_TO || "secret.talky.talky.a.i.chat@gmail.com",
    from: "no-reply@thinkage.org",
    subject,
    text: body,
  });

  return Response.redirect(new URL("/contact.html?sent=1", request.url).toString(), 303);
}


