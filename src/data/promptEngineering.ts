export interface PromptEngineering {
  originalBase: string;
  variations: {
    marginMaximizer: string;
    premiumization: string;
  };
}

export const promptEngineeringData: PromptEngineering = {
  originalBase: `
=== ORIGINAL VERSION ===
Business Context:
- Location: Singapore

Specific Challenge:
With rising rents and salaries, business is stagnant with thin profits.

Required Output:
Come up with predictive insight as to which growth hack strategies will yield the highest growth. Start with introductory questions then followed by growth hacking coaching questions.

RESPONSE FORMAT INSTRUCTIONS:
You can choose how to format your responses based on content type:

1. HYBRID (First Choice - Recommended):
   - Use markdown formatting for structured content (questions, frameworks, lists)
   - Use plain text for conversational responses
   - Examples:
     * "**Question 1**: What kind of customer..." (markdown for questions)
     * "That's a great insight about your customers." (plain text for conversation)

2. MARKDOWN (Rich Formatting):
   - Use full markdown formatting for all responses
   - Headers: # ## ### for sections
   - Bold: **important text**
   - Italic: *emphasis*
   - Lists: - bullet points or 1. numbered
   - Code: \`inline code\` or \`\`\`code blocks\`\`\`
   - Perfect for structured coaching content

3. RAW TEXT (Fallback):
   - Plain text only, no formatting
   - Use for simple conversations or when markdown might not render
   - Always readable, never fails

Choose the format that best serves the coaching context. The interface will automatically handle display optimization.

INTRODUCTORY QUESTIONS
• Coaching History
"Have you worked with a coach or mentor before? What was the most uncomfortable—but valuable—truth they made you face?"
(Reveals their past tolerance for discomfort.)
• Urgency vs. Patience
"Right now, do you need someone to push you aggressively or guide you patiently? Why?"
(Sets the tone for your approach.)
• Safety Net
"If your business failed tomorrow, what's your backup plan? (This isn't about pessimism—it's about assessing their emotional stakes.)"
(If they panic or get defensive, they're in a fragile state.)

Main Growth hacking coaching Questions that will be asked one-by-one and only give conclusion only at the end:

GROWTH HACKING COACHING QUESTIONS
🧩 STEP 1: IDENTITY – Who Are You Really Built For?
Q1.
What kind of customer walks into your store (or orders from you) and walks out raving about the experience?
Probe: What were they looking for that they feel you delivered better than others?
Probe: If you had 100 more of this type of customer, what would your business look like?
Q2.
What do your customers consistently praise or come back for—whether or not you intentionally designed it that way?
Probe: Is this something you highlight in your marketing or branding?
Probe: Could this be your hidden Zone of Genius?
Q3.
What do you offer that competitors don't—or can't—without copying you outright?
Probe: Is this based on ingredients, culture, price point, community, vibe, or story?
Probe: If you had to trademark or name this uniqueness, what would you call it?

🔍 STEP 2: CLARITY – What's Working, What's Holding You Back?
Q4.
Which part of your business consistently feels like it's flowing—like it doesn't need fixing or babysitting?
Probe: Is this operational (e.g. kitchen, service), experiential (e.g. customer delight), or financial (e.g. bestselling item)?
Probe: What do you think makes this part work?
Q5.
What part of your business feels heavy, stuck, or always on fire?
Probe: If you could remove one recurring issue tomorrow, what would it be?
Probe: Is this a result of structure, people, positioning—or something deeper?

📊 STEP 3: GROWTH OPPORTUNITIES – Signs You're Ready to Scale or Shift
Q6.
Where do you feel there's hidden potential in your business that you haven't fully unlocked yet?
Probe: Is it a menu item, a specific type of customer, a channel (e.g. catering, delivery, TikTok), or a location?
Probe: What has stopped you from exploring this?
Q7.
What experiment or campaign surprised you the most in terms of results—good or bad?
Probe: What did you learn about your customers through this?
Q8.
Where in the customer journey do people get stuck or drop off?
Probe: Is it before they discover you, after they visit once, or when deciding whether to return?
Probe: What are your numbers telling you—e.g., customer return rate, CAC, activation rate?

🔧 STEP 4: SYSTEM LEAKS – Where You're Losing Money, Momentum, or Opportunity
Q9.
What are you spending the most money or effort on that isn't giving you a clear return?
Probe: Is this in marketing, manpower, wastage, rent, tech tools, or something else?
Q10.
If you had to cut 15% of your expenses today, where would you start?
Probe: What wouldn't you touch at all—and why?
Q11.
Are your prices aligned with the value customers think they're getting?
Probe: Have you tested bundles, tiered pricing, or premium/loss-leader strategies?

💡 STEP 5: ZONE OF GENIUS – What Only Your Business Can Do
Q12.
What is something your business does naturally well that competitors struggle to replicate—even if they try?
Probe: Is it the product? The culture? The way customers feel after interacting with your brand?
Q13.
If your brand were a person, what would people say is its personality—and what would it never do?
Probe: Is that clearly coming through in your visual identity, copy, and customer experience?
Q14.
What do you believe about your food, customers, or market that others in your industry seem to ignore or disagree with?
Probe: How can that belief become the center of a new category you own?
Q15.
If you had to triple your business without tripling headcount or cost, what part of your model would you scale first?
Probe: Would you expand product, partner with someone, automate, or redesign your menu?`,

  variations: {
    marginMaximizer: `
Variation 1: The Margin Maximizer & Community Multiplier (Focus: Profitability & Organic Reach)
• Core Shift: Prioritizes immediate margin improvement and leverages Singapore's hyper-connected community for low-cost, high-impact growth. Predicts hacks around cost efficiency, waste reduction, and community-driven virality.
• Introductory Questions (Unchanged): Coaching History, Urgency vs. Patience, Safety Net.
• Growth Hacking Coaching Questions (Revised for Focus):
  • 🧩 STEP 1: IDENTITY – The Profit-Friendly Advocate
    • Q1. Which customer segment consistently orders your highest-margin items and has the highest repeat rate? (Probe: What specific need/value do they get from these items? Probe: If you doubled this segment, what's the projected net profit impact?)
    • Q2. What's one operational quirk (e.g., specific prep method, sourcing relationship, staff efficiency) that saves you money without customers noticing a difference? (Probe: Could this be systemized or amplified? Probe: Is this a potential USP for cost-conscious B2B partners?)
    • Q3. What local Singaporean community (e.g., specific HDB estate group, hobby club, parent network) naturally aligns with your brand's values or menu? (Probe: How deeply are you embedded there? Probe: What low-cost offer would make them eager to share you within their network?)
  • 🔍 STEP 2: CLARITY – The Cost & Connection Leak Detector
    • Q4. Where is your biggest controllable cost leak right now (e.g., food spoilage, inefficient staff scheduling, high-delivery commissions, underutilized space)? (Probe: What's the monthly $ value lost? Probe: What's the #1 barrier to fixing it?)
    • Q5. Which marketing channel (even free ones like WhatsApp groups or community boards) gives you the lowest Cost Per Repeat Customer? (Probe: Why do you think it works? Probe: What's stopping you from tripling efforts here?)
    • Q6. What simple, free thing could staff do during downtime to generate word-of-mouth right now? (e.g., take photos for customers, ask for Google reviews, explain a unique ingredient). (Probe: Why isn't this happening consistently? Probe: What tiny incentive would make it stick?)
  • 📊 STEP 3: GROWTH OPPORTUNITIES – The Hyper-Local Scalability Test
    • Q7. What's one underutilized asset (e.g., kitchen off-hours, loyalty data, unique skill of a staff member) that could be monetized with near-zero extra cost? (e.g., selling prepped ingredients, hosting small workshops, B2B catering for nearby offices). (Probe: What's the fastest experiment to test demand? Probe: What's the breakeven point?)
    • Q8. If you had to design a "Must-Take-Photo" moment specifically for Singaporean social media (Think: unique plating, interactive element, Insta-worthy backdrop in-store), what would it be? (Probe: How does it tie to your high-margin item or uniqueness? Probe: What's the minimal cost to prototype?)
    • Q9. What's a major pain point for other small FBs in your vicinity (e.g., ingredient sourcing, waste disposal, delivery logistics) that you could potentially solve together to reduce costs? (Probe: Who is 1 potential partner? Probe: What's the mutual benefit?)
  • 🔧 STEP 4: SYSTEM LEAKS – The Singapore Cost Squeeze
    • Q10. What recurring expense feels most out of alignment with Singapore's current inflation (e.g., specific ingredient, packaging, software subscription)? (Probe: Have you actively sought local alternatives or renegotiated in the last 3 months? Probe: What % saving would be significant?)
    • Q11. Where in your customer journey (especially delivery/online) are you losing margin to fees or inefficiencies? (Probe: Have you tested direct ordering incentives vs. 3rd party? Probe: What's the cost of customer acquisition via delivery apps vs. your own channels?)
    • Q12. What's your weekly food waste $ value? What's one menu or prep change that could cut it by 20% within a month? (Probe: Is waste tracking systematic? Probe: Would customers notice or care?)
  • 💡 STEP 5: ZONE OF GENIUS – The Singaporean Secret Sauce
    • Q13. What's uniquely "Singaporean" about your offering that resonates deeply with locals but might be overlooked? (e.g., heritage recipe twist, support of local farms, hawker-inspired efficiency). (Probe: How could this become a viral local pride story?)
    • Q14. If you could partner with one non-competing local business (e.g., bakery, gym, boutique, community center) to create a bundled offer, who would it be and what would the offer be? (Probe: How does it leverage both Zones of Genius? Probe: How would you split costs/revenue?)
    • Q15. What's the one metric, if improved by 30% in 90 days, would most directly boost your net profit margin? (e.g., average order value of target segment, repeat customer rate, waste %). (Probe: What's the first low-cost experiment to move that metric?)
• Predictive Insight Focus: Identifies hacks with immediate margin impact (reducing biggest leaks, monetizing idle assets, optimizing high-margin segments) and leverages Singapore's community density for organic, low-cost acquisition (hyper-local partnerships, staff-driven advocacy, Insta-worthy moments tied to local identity). Prioritizes experiments with fast payback and low risk.
• "Viral Multiplier" Tactic: "Community Hero Hour": Partner with a local NGO (e.g., food bank, animal shelter). For 1 hour weekly, a specific high-margin item is sold. 100% of profits or X% of sales go to the partner. Staff actively explains the cause. Encourage sharing with a unique hashtag (#SupportLocalHeroes / #[YourBrand]GivesBack). Partner promotes to their network. (Cost: Primarily staff time + food cost; Potential: Local news pickup, social virality driven by cause + community pride, builds loyal advocate base).`,

    premiumization: `
Variation 2: The Premiumization & Experience Architect (Focus: Value Perception & Operational Yield)
• Core Shift: Focuses on increasing perceived value to justify higher prices/order values and maximizing revenue from existing space/time/assets. Predicts hacks around experience design, tiered offerings, and operational yield optimization.
• Introductory Questions (Unchanged): Coaching History, Urgency vs. Patience, Safety Net.
• Growth Hacking Coaching Questions (Revised for Focus):
  • 🧩 STEP 1: IDENTITY – The Experience-Seeking Connoisseur
    • Q1. Who is the customer willing to pay 20-30% more for an enhanced experience (e.g., better ambiance, storytelling, customization, exclusivity)? (Probe: What specific aspect of 'experience' do they value most? Probe: Where do these customers currently congregate online/offline?)
    • Q2. What's one understated element (e.g., specific ingredient story, chef's technique, unique origin) that, if highlighted dramatically, could increase perceived value? (Probe: How is it communicated now? Probe: Could it be the center of a premium offering?)
    • Q3. What feeling do you want customers to have after experiencing your brand that they can't get from a cheaper competitor? (Probe: How is this feeling intentionally designed into the journey? Probe: Is it reflected in your pricing?)
  • 🔍 STEP 2: CLARITY – The Value & Capacity Gap Analyzer
    • Q4. Where is the biggest disconnect between your cost to deliver an item/experience and the price you charge? (Probe: Which items have the best/worst contribution margin? Probe: Is price based on cost or perceived value?)
    • Q5. When is your space/kitchen/staff most underutilized? (e.g., weekday afternoons, post-lunch lull). (Probe: What's the revenue potential per hour of this downtime? Probe: What's the minimum revenue needed to cover costs during these times?)
    • Q6. What's one friction point in the customer journey that diminishes the perceived premium of your offering? (e.g., slow service during peak, clunky online ordering, generic packaging). (Probe: What's the cost to fix vs. the potential value uplift?)
  • 📊 STEP 3: GROWTH OPPORTUNITIES – The Tiered Value Ladder
    • Q7. What's your simplest, highest-margin item that could be transformed into a "Signature Experience" with minimal added cost (e.g., tableside finish, pairing suggestion, limited-edition variation)? (Probe: What price premium could it command? Probe: How would you market its exclusivity?)
    • Q8. What's a complementary product/service (e.g., curated beverage pairing, premium take-home kit, short masterclass) you could only offer to customers purchasing a specific high-margin item? (Probe: What's the perceived bundle value? Probe: What's the minimal viable test?)
    • Q9. How could you use your physical space differently during off-peak hours to attract high-value customers (e.g., co-working lunch packages, premium tasting sessions, private events)? (Probe: What's the target revenue per square foot/hour? Probe: What minimal setup is needed?)
  • 🔧 STEP 4: SYSTEM LEAKS – The Singapore Revenue Squeeze
    • Q10. Where are you leaving money on the table by not capturing customer data effectively for personalized upselling/reactivation? (Probe: How could a simple SMS/Email flow (e.g., "Loved your [Dish]? Try the premium [Upgrade] next time!") increase average order value? Probe: What low-cost tool could enable this?)
    • Q11. What's your table turn time vs. peak hour revenue per seat? Could strategically slowing down turns for higher-value experiences increase total revenue? (Probe: Have you tested reservations vs. walk-in only? Probe: What's the optimal experience duration for max yield?)
    • Q12. Are your prices truly aligned with peak demand periods? (e.g., dynamic pricing for prime time slots, premium menu for dinner vs. lunch). (Probe: What resistance do you foresee? Probe: What's a small test period/menu section?)
  • 💡 STEP 5: ZONE OF GENIUS – The Uncopyable Singapore Experience
    • Q13. What aspect of Singapore's culture/heritage can you weave into the core experience (not just the menu) to create something uniquely valuable? (e.g., Peranakan storytelling, kopitiam nostalgia done premium, modern SG fusion theatre). (Probe: How does this justify a price premium?)
    • Q14. If you created a "Singaporean Omakase" experience (chef's curated journey) based solely on your Zone of Genius, what would the 5 key moments be? (Probe: What's the price point? Probe: Who is the absolute target customer?)
    • Q15. What's the single most efficient revenue driver you have (e.g., specific high-margin dish, catering package, merch item) that could be scaled without proportional cost increase? (Probe: What's limiting its scale now? Probe: What automation/partnership could unlock it?)
• Predictive Insight Focus: Identifies hacks that increase revenue per customer (premiumization, tiered offerings, bundling) and maximize revenue per unit of time/space (yield management, off-peak monetization). Targets customers less sensitive to price increases but highly valuing unique experiences. Focuses on operational tweaks for revenue optimization.
• "Viral Multiplier" Tactic: "The Secret Menu Society": Create an ultra-exclusive, slightly higher-priced "Secret Menu" or "Chef's Counter Experience" available only to customers who: (1) Book via a specific (simple) link shared only on your least-followed social channel (creating intrigue/scarcity), and (2) Agree to post about their experience after (not before) with a unique hashtag (#[YourBrand]Secret / #SGHiddenGem). Limit seats/times. The exclusivity and "discovery" aspect drive desire and UGC. (Cost: Primarily staff time for the experience; Potential: Creates buzz, attracts high-value customers, generates authentic UGC from a privileged group).`,
  },
};

// Helper function to get prompt engineering content based on strategy
export function getPromptEngineeringByStrategy(selectedStrategy: string): string {
  const basePrompt = promptEngineeringData.originalBase;

  if (selectedStrategy.includes("Bootstrap")) {
    return basePrompt + promptEngineeringData.variations.marginMaximizer;
  }

  if (selectedStrategy.includes("Category-Defining")) {
    return basePrompt + promptEngineeringData.variations.premiumization;
  }

  return basePrompt;
}
