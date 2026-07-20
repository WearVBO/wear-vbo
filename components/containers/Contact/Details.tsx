import React from "react";
import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
// import { Input } from "@heroui/input";
// import { Form } from "@heroui/form";
// import {Textarea} from "@heroui/input";

const Details = () => {
  // contact info
  const contactInfo = [
    {
      icon: <FiPhone size={24} />,
      detail: "09086778654",
    },
    {
      icon: <MdOutlineEmail size={24} />,
      detail: "hi@hotmail.com",
    },
  ];

  // input
  // const inputInfo = [
  //   {
  //     type: "text",
  //     label: "Name",
  //     placeholder: "Enter your name",
  //   },
  //   {
  //     type: "email",
  //     label: "Email",
  //     placeholder: "Enter your Email...",
  //   },
  //   // {
  //   //   type: "text",
  //   //   label: "Message",
  //   //   placeholder: "Your message",
  //   // },
  // ];
  return (
    <section className="px-4 md:px-14 py-7 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* get in touch */}
        <div className="w-full">
          <h1 className="text-3xl md:text-4xl font-bold">Get in touch</h1>
          <p className="text-md md:text-lg text-black/70 py-3 w-full max-w-[350px] md:max-w-[380px]">
            We&apos;re here to help! Whether you have a question about our
            services or want to provide feedback, our team is ready to assist
            you.
          </p>
          {/* left: contact details */}
          <div className="flex flex-col gap-5 mt-4">
            {contactInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-5 font-bold text-lg">
                <span>{info.icon}</span>
                <p>{info.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/*right: form */}
        <form className="flex flex-col gap-5">
          {/* Name + Email side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-200 bg-gray-100 rounded-md px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email..."
                className="border border-gray-200 bg-gray-100 rounded-md px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Your Message
            </label>
            <textarea
              placeholder="Enter your message..."
              rows={5}
              className="border border-gray-200 bg-gray-100 rounded-md px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-black text-white text-sm font-semibold uppercase tracking-widest py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Details;
