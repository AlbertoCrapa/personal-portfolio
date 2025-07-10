import React from "react";

const MailCTA = ({ contact }) => (
  <a
    href={`mailto:${contact.email}`}
    className="block w-full mx-auto py-4 bg-white text-3xl md:text-8xl lg:text-8xl text-black font-medium rounded-xl hover:scale-[1.03] active:scale-[0.95] transition"
    style={{ maxWidth: "100%", wordBreak: "break-word" }}
  >
    hello@albyeah.com
  </a>
);

export default MailCTA;
