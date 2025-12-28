"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@blackmoss/ui";
import { ProductFAQ as ProductFAQType } from "@prisma/client";

interface ProductFAQProps {
  faqs: ProductFAQType[];
}

export function ProductFAQ({ faqs }: ProductFAQProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
