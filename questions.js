const FAQ_CATEGORIES = [
  { category: "Pricing & process", questions: [
    "What does a piece typically cost?",
    "What's your price range?",
    "Do prices vary by size or material?",
    "Is pricing different for a custom commission vs. an existing piece?",
    "Do you offer payment plans?",
    "Is there a deposit required?",
    "What's included in the price — delivery, installation, both?",
    "Do you charge differently for corporate vs. private buyers?",
    "Is there a rush fee for a tight timeline?",
    "Do you offer a trade/gallery discount?",
  ]},
  { category: "The piece itself", questions: [
    "What materials do you work with?",
    "How long does a typical installation take to create?",
    "Can a piece be customized in size or color?",
    "Is this piece one-of-a-kind or part of an edition?",
    "What inspired this piece?",
    "How much does it weigh?",
    "What are the exact dimensions?",
    "Can I see it in person before buying?",
    "Do you have more pieces like this one?",
    "What's the largest piece you've made?",
    "What's the smallest?",
  ]},
  { category: "Installation & logistics", questions: [
    "Is this a permanent or movable installation?",
    "How is it installed?",
    "Who handles installation — you or a contractor?",
    "How long does installation take on-site?",
    "What structural requirements does my space need?",
    "Do you handle shipping?",
    "What's your service area?",
    "Do you install outside the country?",
    "What happens if the space changes (move, renovation)?",
    "Is there a warranty on the installation itself?",
  ]},
  { category: "The tax angle", questions: [
    "Is this tax-deductible?",
    "What's the difference between a permanent installation and a movable piece for tax purposes?",
    "Should I talk to my accountant before buying?",
    "Do you provide documentation for tax purposes?",
    "Does this qualify for Section 179?",
    "Is there a difference in tax treatment for a nonprofit or museum buyer?",
  ]},
  { category: "Maintenance & care", questions: [
    "How do I clean/maintain this piece?",
    "Does it need climate control?",
    "Is it durable outdoors?",
    "What happens if it's damaged?",
    "Do you offer repair services?",
    "How long will it last?",
  ]},
  { category: "Buyer-type specific", questions: [
    "Do you work with museums?",
    "Do you work with real estate developers?",
    "Have you done corporate lobby installations before?",
    "Can you show me examples in a similar industry to mine?",
    "Do you offer anything scaled for a smaller office vs. a large corporate space?",
  ]},
  { category: "Business/trust questions", questions: [
    "How long have you been doing this?",
    "Can I see past projects?",
    "Do you have references/testimonials?",
    "Are you insured?",
    "What's your process from first conversation to installed piece?",
    "How do I start?",
  ]},
  { category: "Booking/next step", questions: [
    "How do I get a quote?",
    "Can I schedule a call?",
    "What information do you need from me to get started?",
    "How soon can you start a new project?",
  ]},
];

const DEFAULT_GUARDRAILS = [
  "Legal/contract specifics",
  "Final price negotiation",
  "Past disputes or negative reviews",
  "Personal questions unrelated to the business",
];

const ALL_QUESTIONS = FAQ_CATEGORIES.flatMap((c) =>
  c.questions.map((q) => ({ category: c.category, question: q }))
);
