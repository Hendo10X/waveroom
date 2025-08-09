import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function Faqs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="w-full py-8 lg:py-16 bg-background font-inter">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-tighter font-regular mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-muted-foreground">
              Everything you need to know about Waveroom
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}>
            <Accordion
              type="single"
              collapsible
              className="max-w-2xl mx-auto font-inter">
              <div className="flex flex-col gap-4 px-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-muted-foreground text-base font-medium ">
                      What is the purpose of this website?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      This website is a platform for users to discover and share
                      music.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-muted-foreground text-base font-medium ">
                      How does it work?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      Users can discover and share music with others.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-muted-foreground text-base font-medium ">
                      How can I get started?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      Users can discover and share music with others.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </div>
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
