"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Who can participate in the hackathon?",
      answer:
        "The hackathon is open to all first-year students from any college or university. You don't need prior experience - beginners are welcome!",
    },
    {
      question: "Do I need to have a team before registering?",
      answer:
        "We recommend forming teams of 2-4 members.",
    },
    {
      question: "What should I bring to the hackathon?",
      answer:
        "Bring your laptop, chargers, and any necessary development tools.",
    },
    {
      question: "Are there any fees for participation?",
      answer: "Yes , the registration fee is just ₹75 per participant - Limited slots available, Hurry before prices increase!",
    },
    {
      question: "What are the judging criteria?",
      answer:
        "Projects are judged on innovation, technical complexity, design, and impact. We also consider how well you present your idea and MVP.",
    },
    {
      question: "Can we submit ideas from previous projects?",
      answer:
        "No, all projects must be created during the hackathon event. However, you can use existing open-source libraries and frameworks.",
    },
  ]

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Frequently Asked <span className="text-accent">Questions</span>
        </h2>
        <p className="text-center text-foreground/60 mb-12">Got questions? We've got answers!</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-effect rounded-lg overflow-hidden border border-accent/20 hover:border-accent/50 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/5 transition-colors duration-300"
              >
                <span className="text-lg font-semibold text-foreground text-left">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-accent transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 border-t border-accent/20 bg-accent/5">
                  <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
