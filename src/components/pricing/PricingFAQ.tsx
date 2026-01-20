import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';
import { faqData } from '@/data/pricingData';

export const PricingFAQ: React.FC = () => {
  return (
    <section className="h-full relative">
      {/* Clean Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Everything you need to know about our pricing
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
      </div>

      {/* FAQ Accordion */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b border-border/30 last:border-0 px-5 data-[state=open]:bg-muted/30 transition-colors duration-200"
            >
              <AccordionTrigger className="py-4 hover:no-underline group">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted/60 text-muted-foreground text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pl-9 pr-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
