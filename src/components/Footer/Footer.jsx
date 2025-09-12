import React from "react";
import SocialPanel from "../SocialPanel/SocialPanel";

const Footer = ({ contact, showMailCTA = true, MailCTAComponent }) => (
  <section
    id="contact"
    className="py-4 pt-32 bg-black"
  >
    <div className="container  mx-auto px-4 text-center">
      <h2 className="text-4xl font-semibold mb-6 text-white">Get In Touch</h2>
      {showMailCTA && MailCTAComponent && <MailCTAComponent contact={contact} />}
      <SocialPanel contact={contact} className="mt-8 mb-8" />
    </div>
    <p className="w-fit mx-auto bottom-0 pt-8 text-gray-dark ">
      © 2025 Alberto Crapanzano. All rights reserved.
    </p>
  </section>
);

export default Footer;
