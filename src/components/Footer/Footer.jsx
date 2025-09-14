import React from "react";
import SocialPanel from "../SocialPanel/SocialPanel";

const Footer = ({ contact, showMailCTA = true, MailCTAComponent }) => (
  <section
    id="contact"
    className="py-4 pt-12 md:pt-28 bg-black aa "
  >
    <div className="container  mx-auto px-4 text-center">
      <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-white">Get In Touch</h2>
      {showMailCTA && MailCTAComponent && <MailCTAComponent contact={contact} />}
      <SocialPanel contact={contact} className="mt-8 md:mb-8 mb-1" />
    </div>
    <p className="w-fit mx-auto bottom-0 pt-8 text-gray-light opacity-70 md:text-md  text-sm ">
      © 2025 Alberto Crapanzano. All rights reserved.
    </p>
  </section>
);

export default Footer;
