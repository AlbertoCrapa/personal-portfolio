import React from "react";

const MailCTA = ({ contact }) => (
  <a
    href={`mailto:${contact.email}`}
    className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
  >
    Email Me
  </a>
);

export default MailCTA;
