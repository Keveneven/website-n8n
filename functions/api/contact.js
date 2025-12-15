import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  const name = form.get("name") || "";
  const email = form.get("email") || "";
  const company = form.get("company") || "";
  const service = form.get("service") || "";
  const message = form.get("message") || "";

  const text =
`New Thinkage Contact Form Submission

Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Service: ${service || "N/A"}

Message:
${message}
`;

  const msg = createMimeMessage();
  // "From" can be anything on your domain; it doesn't need to be a real inbox.
  msg.setSender({ name: "Thinkage Website", addr: "no-reply@thinkage.org" });
  msg.setRecipient(env.CONTACT_SEND.destinationAddress || "secret.talky.talky.a.i.chat@gmail.com");
  msg.setSubject("New Contact Form Submission");
  msg.addMessage({ contentType: "text/plain", data: text });

  const raw = msg.asRaw();

  const emailMessage = new EmailMessage(
    "no-reply@thinkage.org",
    env.CONTACT_SEND.destinationAddress || "secret.talky.talky.a.i.chat@gmail.com",
    raw
  );

  await env.CONTACT_SEND.send(emailMessage);

  // Send them back to the contact page instead of leaving them on /api/contact
  return Response.redirect("/contact.html?sent=1", 303);
}

