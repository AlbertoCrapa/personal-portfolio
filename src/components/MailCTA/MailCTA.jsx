import React from "react";

const MailCTA = ({ contact }) => (
  <a
    href={`mailto:${contact.email}`}
  className="block w-full mx-auto py-4 bg-white text-3xl md:text-7xl lg:text-8xl text-black font-medium rounded-xl hover:scale-[1.03] active:scale-[0.95] transition shadow-none hover:shadow-[0_0_40px_20px_rgba(255,255,255,0.1)]"
    style={{ maxWidth: "100%", wordBreak: "break-word" }}
    data-cursor-text="Send Email"
  >
    hello@albyeah.com
  </a>
);

export default MailCTA;
