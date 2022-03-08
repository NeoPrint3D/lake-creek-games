import { encrypt } from "./encryption";

async function sendEmail(to: String, subject: String, message: String) {
  const res = await fetch("https://email-send-neoprint3d.vercel.app/sendmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: encrypt(
        import.meta.env.VITE_EMAIL_API_KEY,
        import.meta.env.VITE_HASH_KEY
      ),
      to: encrypt(to, import.meta.env.VITE_HASH_KEY),
      subject: encrypt(subject, import.meta.env.VITE_HASH_KEY),
      message: encrypt(message, import.meta.env.VITE_HASH_KEY),
    }),
  });
  console.log(res.status)
  return res.json();
}

export default sendEmail;
