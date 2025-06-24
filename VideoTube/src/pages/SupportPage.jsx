import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContactUs from "@/comps/ContactUs";

const SupportPage = () => {
  const faqItems = [
    {
      question: "Is it a free website?",
      answer:
        "Yes, this website is completely free of cost. Users can enjoy all the features without any charges, making it accessible to everyone.",
    },
    {
      question: "How much videos can a person upload?",
      answer:
        "Data is stored in Cloudinary, ensuring that there is no maximum limit to the number of videos a person can upload. In the event of high load, the creator will implement a plan to manage the storage efficiently, ensuring smooth performance.",
    },
    {
      question: "Can account details be changed?",
      answer:
        "Yes, account details can be changed easily. Users can update their personal information by navigating to the settings section and making the necessary changes. This process is user-friendly and ensures that account details remain up-to-date.",
    },
    {
      question: "What tech stack is used?",
      answer:
        "The tech stack used for this website is MERN (MongoDB, Express, React, Node.js). The UI is designed with the help of shadcn, providing a modern and responsive interface for users.",
    },
  ];

  return (
    <div>
      <div className="text-white flex flex-col pb-4 items-center">
        <header className="mt-8 mb-8">
          <h1 className="text-4xl font-bold">We're here to help</h1>
          <p className="flex justify-center mt-2 text-xl">Here are some FAQs</p>
        </header>
        <div className="w-full max-w-2xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <ContactUs />
    </div>
  );
};

export default SupportPage;
