import React from "react";

const MailCTA = ({ contact }) => (
  <a
    href={`mailto:${contact.email}`}
    className="inline-block max-w-[900px]  w-full lg:w-4/5 mx-auto px-4 md:px-8 lg:px-14 py-3 md:py-4 lg:py-5 bg-white text-4xl md:text-4xl lg:text-7xl xl:text-7xl 2xl:text-7xl text-black font-semibold rounded-bl-none rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-none hover:shadow-[0_0_60px_30px_rgba(255,255,255,0.1)] text-center"
    style={{ wordBreak: "keep-all", whiteSpace: "nowrap" }}
    data-cursor-text="Send Email"
    data-cursor-color="#DC2626"
  >
    hello@albyeah.com
  </a>
);

export default MailCTA;
