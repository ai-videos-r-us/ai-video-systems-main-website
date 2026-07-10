/* =========================================================
   The Founder Message Extraction Workbook — AI Video Systems
   Static, vanilla JS. All data in localStorage. No backend.
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "founderMessageExtractionWorkbook_v1";

  /* ---------------------------------------------------------
     WORKBOOK CONFIG
     Each section: questions (grouped) + output worksheet fields.
     Output fields double as the "Founder Message Bank" items and
     determine section completion.
     --------------------------------------------------------- */

  var DETAILS = {
    id: "details",
    fields: [
      { id: "d_name", label: "Your Name", type: "text", required: true, ph: "e.g. Sean Munn" },
      { id: "d_business", label: "Business Name", type: "text", required: true, ph: "e.g. AI Video Systems" },
      { id: "d_website", label: "Website", type: "text", ph: "e.g. aivideosystems.org" },
      { id: "d_email", label: "Email (optional)", type: "text", ph: "you@business.com" }
    ]
  };

  var SECTIONS = [
    {
      id: "s1",
      title: "Business Snapshot",
      goal: "Define what you sell, who you sell it to, the problem you solve, and the outcome you create.",
      lessonTitle: "Start With The Commercial Reality",
      lesson: [
        "Your message cannot be separated from your business model. The best messaging is built around what you sell, who buys it, why they buy it, what problem they want solved, what outcome they want, what stops them from buying, and what action you want them to take next.",
        "A founder does not need vague content. They need messaging that moves the right buyer closer to action."
      ],
      groups: [
        { title: "Business Basics", questions: [
          "What do you sell?",
          "Who do you sell it to?",
          "What problem do you solve?",
          "What outcome do you help them achieve?",
          "What is the price or typical client value?",
          "What offer, service, or product do you want more sales calls for?",
          "What type of buyer do you want more of?",
          "What type of buyer do you want less of?"
        ]},
        { title: "Client Acquisition", questions: [
          "How do people currently become clients?",
          "Do they book a call, apply, request a demo, DM you, buy directly, or something else?",
          "Where do most of your best clients currently come from?",
          "What is your current biggest acquisition problem?",
          "Are you struggling with traffic, content, leads, booked calls, lead quality, sales conversion, or follow-up?",
          "What is currently working, even slightly?",
          "What used to work but has started slowing down?"
        ]}
      ],
      outputTitle: "Output Worksheet — Positioning Sentence",
      outputHelp: "We help [specific buyer] achieve [specific result] without [main pain/frustration].",
      outputs: [
        { id: "s1o_buyer", label: "Specific buyer", type: "text" },
        { id: "s1o_result", label: "Specific result", type: "text" },
        { id: "s1o_pain", label: "Main pain / frustration", type: "text" },
        { id: "s1o_sentence", label: "Final positioning sentence", rows: 3, hint: "We help [buyer] achieve [result] without [pain]." }
      ],
      example: "We help expert-led founders generate more qualified sales calls without filming every day, hiring UGC creators, or building disconnected funnels."
    },

    {
      id: "s2",
      title: "Founder Truth",
      goal: "Extract your real point of view, beliefs, opinions, repeated sales arguments, and market truths.",
      lessonTitle: "Founder Truth Extraction",
      lesson: [
        "Most AI content is weak because it starts with shallow prompts. Strong content starts with founder truth.",
        "Founder truth includes what you believe, what you disagree with, what you keep saying on sales calls, what your market needs to hear, what annoys you about your industry, what your experience has taught you, and what you know that your buyer does not yet understand.",
        "AI can help produce assets, but the founder must supply the truth. Without founder truth, content becomes flat. With founder truth, content becomes sharp, specific, and memorable."
      ],
      groups: [
        { title: "Beliefs", questions: [
          "What do you believe that your market needs to hear?",
          "What do you believe that your competitors do not say enough?",
          "What advice do you keep giving prospects again and again?",
          "What do you believe about the problem you solve?",
          "What do you believe about the outcome your buyer wants?"
        ]},
        { title: "Frustrations", questions: [
          "What are you tired of seeing in your industry?",
          "What annoys you about how people sell similar solutions?",
          "What do you refuse to do that others in your market do?",
          "What do you think has become normal but should not be normal?",
          "What behaviour, belief, or tactic do you think is hurting buyers?"
        ]},
        { title: "Market Misunderstandings", questions: [
          "What do most people get wrong about solving the problem you solve?",
          "What do clients usually misunderstand before working with you?",
          "What does your buyer think they need, but actually does not need?",
          "What does your buyer ignore that actually matters?",
          "What is the “wrong way” people try to solve this problem?"
        ]},
        { title: "Your Better Way", questions: [
          "What is your better way?",
          "Why does your way work better?",
          "What do you do differently from the usual approach?",
          "Why did you start selling this offer in the first place?",
          "What do you wish every prospect understood before speaking to you?"
        ]}
      ],
      outputTitle: "Output Worksheet — Founder Message Bank",
      outputs: [
        { id: "s2o_beliefs", label: "5 founder beliefs", rows: 5, hint: "I believe [market/buyer] needs to understand that [belief]." },
        { id: "s2o_contrarian", label: "5 contrarian opinions", rows: 5, hint: "Most people think [common belief], but I believe [your belief]." },
        { id: "s2o_wrong", label: "5 things their market gets wrong", rows: 5, hint: "My market gets [topic] wrong because they think [wrong belief], when actually [truth]." },
        { id: "s2o_ways", label: "5 wrong way vs right way angles", rows: 5, hint: "Wrong way: [common mistake]  /  Right way: [better method]" }
      ]
    },

    {
      id: "s3",
      title: "Buyer Pain",
      goal: "Extract buyer pain, hidden problems, failed attempts, root causes, and cost of inaction.",
      lessonTitle: "Buyer Pain Extraction",
      lesson: [
        "Buyers rarely describe their problem perfectly. They usually describe symptoms.",
        "For example, a founder may say: “My ads are not working.” But the real issue may be that the creative has gone stale, the offer angle is weak, the hook is not specific enough, the audience has seen the same promise too many times, there is no proof in the ad, the landing page does not match the message, or the follow-up is poor.",
        "Strong messaging helps the buyer understand the real problem. When you can name the pain better than the buyer can, trust increases."
      ],
      groups: [
        { title: "Known Pain", questions: [
          "What problem does your buyer know they have?",
          "What words do they use to describe that problem?",
          "What are they actively trying to fix?",
          "What are they frustrated by right now?",
          "What are they complaining about privately?"
        ]},
        { title: "Hidden Pain", questions: [
          "What problem do they not realise they have yet?",
          "What symptoms are they experiencing?",
          "What do they think is causing the problem?",
          "What are they blaming incorrectly?",
          "What is the real root cause?"
        ]},
        { title: "Failed Attempts", questions: [
          "What have they already tried?",
          "Why did those things not work?",
          "What solutions disappointed them?",
          "What have they spent money on that did not solve the real issue?",
          "What are they now sceptical of because of those failed attempts?"
        ]},
        { title: "Cost Of Inaction", questions: [
          "What happens if they do nothing for another 6 months?",
          "What does this problem cost them in revenue?",
          "What does it cost them in time?",
          "What does it cost them in confidence?",
          "What are they secretly worried about?"
        ]}
      ],
      outputTitle: "Output Worksheet — Buyer Pain Bank",
      outputs: [
        { id: "s3o_pain", label: "10 pain angles", rows: 6, hint: "Your buyer is struggling with [pain] because [reason]." },
        { id: "s3o_failed", label: "5 failed-attempt angles", rows: 5, hint: "They tried [solution], but it failed because [reason]." },
        { id: "s3o_real", label: "5 “real problem is not X, it’s Y” angles", rows: 5, hint: "The real problem is not [surface issue]. The real problem is [deeper issue]." },
        { id: "s3o_cost", label: "5 cost-of-inaction angles", rows: 5, hint: "If [buyer] does not solve [problem], they risk [consequence]." }
      ],
      example: "Your ads are not always dying because of targeting. Sometimes the market has just seen the same hook, proof, promise, and angle too many times."
    },

    {
      id: "s4",
      title: "Proof Vault",
      goal: "Extract results, testimonials, client stories, before/after states, proof points, and transformation moments.",
      lessonTitle: "Proof & Case Study Extraction",
      lesson: [
        "Proof makes messaging believable. A claim says: “We can help you get more sales calls.” Proof says: “Here is what changed when we applied the method.”",
        "Strong proof is not only about big numbers. It can include a shift in confidence, a better process, faster execution, less dependency on the founder, better lead quality, clearer positioning, more qualified conversations, reduced waste, or shorter time to action."
      ],
      groups: [
        { title: "Results", questions: [
          "What results have you helped clients achieve?",
          "What specific numbers can you use?",
          "What before/after improvements can you show?",
          "What client wins are worth documenting?",
          "What changed after they worked with you?"
        ]},
        { title: "Testimonials", questions: [
          "What testimonials do you have?",
          "What client quotes can you use?",
          "What phrases have clients said that show the value of your work?",
          "What screenshots, messages, emails, or feedback can you use?",
          "What proof do you already have but rarely share?"
        ]},
        { title: "Story", questions: [
          "What client stories prove your method works?",
          "What was the client struggling with before?",
          "What objection did they have before buying?",
          "What did you help them change?",
          "What happened afterwards?"
        ]},
        { title: "Usage", questions: [
          "What proof can you use in content?",
          "What proof can you use in ads?",
          "What proof can you use in VSLs?",
          "What proof can you use in emails?",
          "What proof can you use on your booking page?"
        ]}
      ],
      outputTitle: "Output Worksheet — Proof Bank",
      outputs: [
        { id: "s4o_cases", label: "3 mini case studies", rows: 8, hint: "Before / Problem / Intervention / Result / Lesson" },
        { id: "s4o_points", label: "10 proof points", rows: 6, hint: "We helped [client/type] achieve [result] by [method/change]." },
        { id: "s4o_testi", label: "5 testimonial-based content ideas", rows: 5, hint: "Client said: “[quote]” → Content idea: [angle]" },
        { id: "s4o_ads", label: "5 proof-based ad angles", rows: 5, hint: "Ad angle: [transformation]  /  Proof used: [testimonial, number, before/after, story]" }
      ]
    },

    {
      id: "s5",
      title: "Objection Vault",
      goal: "Turn buyer objections into content, ads, emails, retargeting, sales page copy, VSL sections, and sales call assets.",
      lessonTitle: "Objection Mining",
      lesson: [
        "A buyer does not usually buy when they understand the offer. They buy when enough doubt has been removed.",
        "Objections reveal the buyer’s fear. They may be worried about price, time, trust, complexity, previous bad experiences, whether it will work for them, whether they have the resources, whether now is the right time, whether they will look stupid, or whether they will waste money again.",
        "Strong messaging does not avoid objections. It handles them before the sales call."
      ],
      groups: [
        { title: "Common Objections", questions: [
          "What objections do prospects raise before buying?",
          "What do they say about price?",
          "What do they say about timing?",
          "What do they say about trust?",
          "What do they say about previous bad experiences?"
        ]},
        { title: "Hidden Objections", questions: [
          "What makes them hesitate?",
          "What do they misunderstand about your process?",
          "What do they think they need before they can work with you?",
          "What do they fear might happen if they buy?",
          "What do they fear might happen if they do not buy?"
        ]},
        { title: "Belief Shifts", questions: [
          "What do they need to believe before booking a call?",
          "What do they need to believe about you?",
          "What do they need to believe about themselves?",
          "What do they need to believe about the problem?",
          "What do they need to believe about your method?"
        ]},
        { title: "Proof & Reframes", questions: [
          "What proof would reduce their fear?",
          "What story would help them understand the truth?",
          "What would you say to this objection on a sales call?",
          "What is the honest reframe?",
          "What content could you create to answer this objection before they speak to you?"
        ]}
      ],
      outputTitle: "Output Worksheet — Objection Bank",
      outputs: [
        { id: "s5o_posts", label: "10 objection-handling posts", rows: 6, hint: "Objection: “[objection]”  /  Reframe: “[new way to think]”  /  Post idea: [angle]" },
        { id: "s5o_retarget", label: "5 retargeting ad ideas", rows: 5, hint: "Objection → Retargeting angle → Asset idea (short video, testimonial, FAQ ad, case study)" },
        { id: "s5o_email", label: "5 email nurture ideas", rows: 5, hint: "Email topic (objection) → Core message (belief shift) → Proof/story" },
        { id: "s5o_calls", label: "5 sales call talking points", rows: 5, hint: "When they say “[objection]” → Say “[response]” → Support with [proof/story/reframe]" }
      ],
      example: "Objection: “I don’t have time to film content.”  Reframe: “You do not need to become the content team. You need to become the source of the message.”  Content angle: Founder-led does not mean founder-filmed."
    },

    {
      id: "s6",
      title: "The Mechanism",
      goal: "Name and explain your unique process, framework, system, or mechanism.",
      lessonTitle: "Unique Mechanism Extraction",
      lesson: [
        "Most businesses describe their offer in generic terms. They say things like “we do marketing”, “we help with growth”, “we create content”, “we run ads”, “we help you get leads”, or “we build funnels.” That is not enough.",
        "A strong offer needs a mechanism. The mechanism explains why your method works better than the usual way.",
        "A mechanism can include your process, sequence, framework, diagnostic method, delivery model, unique combination of steps, language, or visual model."
      ],
      groups: [
        { title: "Process", questions: [
          "What is your process called?",
          "What steps do you take clients through?",
          "What do you do first that others skip?",
          "What happens after the first step?",
          "What does the full journey look like from start to finish?"
        ]},
        { title: "Differentiation", questions: [
          "Why does your method work better than the usual way?",
          "What do you include that competitors ignore?",
          "What mistake does your mechanism prevent?",
          "What makes the result more likely?",
          "What makes your approach hard to copy?"
        ]},
        { title: "Language", questions: [
          "What language do you want to own?",
          "What phrases do you use often on sales calls?",
          "What is your “new way” of solving the problem?",
          "What is the old way your market is stuck in?",
          "What do you want buyers to repeat after hearing your message?"
        ]},
        { title: "Visual Model", questions: [
          "What is the simple visual model behind your method?",
          "Can your method be shown as steps, pillars, a ladder, a flywheel, a map, or a system?",
          "What comes first?",
          "What comes last?",
          "What part creates the biggest breakthrough?"
        ]}
      ],
      outputTitle: "Output Worksheet — Mechanism Bank",
      outputs: [
        { id: "s6o_name", label: "Mechanism name", type: "text", hint: "The [Result] System / The [Buyer] Method / The [Problem] Framework / The [Outcome] Mechanism" },
        { id: "s6o_steps", label: "3–7 process steps", rows: 7, hint: "Step [n]: [Step name] — Purpose: [why this step matters]" },
        { id: "s6o_content", label: "5 mechanism content angles", rows: 5, hint: "Most people try to get [result] by [old way]. Our mechanism works differently because [new way]." },
        { id: "s6o_ads", label: "5 mechanism ad angles", rows: 5, hint: "Ad angle: [part of mechanism]  /  Why it matters: [benefit]  /  Hook: [opening line]" }
      ],
      example: "Founder expertise → buyer psychology → creative angles → AI videos → paid ads → backend funnel → nurture → qualified sales calls."
    },

    {
      id: "s7",
      title: "Founder Story",
      goal: "Extract story, authority, lessons learned, belief shifts, and mission — without generic personal brand content.",
      lessonTitle: "Founder Story & Authority Angles",
      lesson: [
        "Founder story is not about making everything about you. It is about showing the buyer why you see the problem differently. Your story becomes powerful when it connects to the market’s pain.",
        "Useful founder stories usually come from a frustration you noticed, a repeated client problem, a mistake you made, a belief you changed, a pattern you saw, a lesson from the market, a personal reason behind the mission, or a moment where you realised the old way was broken.",
        "The best founder stories make the buyer think: “This person understands the problem better than most.”"
      ],
      groups: [
        { title: "Origin", questions: [
          "Why did you start doing this work?",
          "What did you notice in the market that annoyed you?",
          "What problem kept showing up again and again?",
          "What personal experience shaped your point of view?",
          "What made you realise this offer needed to exist?"
        ]},
        { title: "Lessons", questions: [
          "What did you used to believe that you no longer believe?",
          "What have clients taught you?",
          "What mistakes have you made that your buyers can learn from?",
          "What hard lesson changed how you sell, deliver, or think?",
          "What have you seen fail too many times?"
        ]},
        { title: "Authority", questions: [
          "What do you want to be known for?",
          "What have you become especially good at?",
          "What do you understand about your market that others miss?",
          "What do clients come to you for specifically?",
          "What proof supports your authority?"
        ]},
        { title: "Mission", questions: [
          "What hill would you die on in your market?",
          "What is the mission behind your offer?",
          "What do you want to help buyers escape from?",
          "What do you want to help buyers build instead?",
          "What change do you want to create in your market?"
        ]}
      ],
      outputTitle: "Output Worksheet — Founder Story Bank",
      outputs: [
        { id: "s7o_story", label: "5 founder story posts", rows: 6, hint: "I started doing [work] because I kept seeing [problem]. Most people did [old way]. I realised [lesson]. That is why I believe [belief]." },
        { id: "s7o_authority", label: "5 authority posts", rows: 5, hint: "After working with [market], I noticed [pattern]. The real issue is [insight]. The better way is [method]." },
        { id: "s7o_lesson", label: "5 lesson-learned posts", rows: 5, hint: "I used to think [old belief]. Now I believe [new belief]. The lesson: [lesson]." },
        { id: "s7o_shift", label: "5 belief-shift posts", rows: 5, hint: "The shift is not from [old way] to [slightly better old way]. It is from [old belief] to [new belief]." }
      ]
    },

    {
      id: "s8",
      title: "Asset Generator",
      goal: "Turn the extracted raw material into usable marketing assets across the buyer journey.",
      lessonTitle: "Turn The Workbook Into Assets",
      lesson: [
        "The workbook is not the final result. The workbook is the source material. Once the founder has extracted the message, it can be turned into assets across the whole buyer journey.",
        "Top of funnel builds awareness and problem recognition: LinkedIn posts, X posts, short-form videos, educational content, contrarian content, founder belief posts.",
        "Middle of funnel builds trust, desire, and belief: proof posts, case studies, email nurture, mechanism explanations, retargeting content, founder story content.",
        "Bottom of funnel increases action: booking page copy, sales page sections, VSL sections, objection-handling ads, sales call talking points, application page bullets."
      ],
      groups: [
        { title: "Reference Templates", questions: [] } // no questions; this is a synthesis section
      ],
      hideEmptyGroups: true,
      outputTitle: "Output Worksheet — Asset Bank",
      outputs: [
        { id: "s8o_social", label: "10 LinkedIn/X post ideas", rows: 7, hint: "Post idea / Hook / Core message / CTA" },
        { id: "s8o_shortform", label: "10 short-form video ideas", rows: 7, hint: "Video idea / Opening hook / Teaching point / Visual idea / CTA" },
        { id: "s8o_aiads", label: "10 AI video ad angles", rows: 7, hint: "Ad angle / Buyer pain / Hook / Proof or reframe / CTA" },
        { id: "s8o_retarget", label: "5 retargeting content ideas", rows: 5, hint: "Retargeting idea / Warm audience / Objection handled / Proof used / CTA" },
        { id: "s8o_email", label: "5 email nurture ideas", rows: 5, hint: "Email idea / Subject angle / Core message / Proof or story / CTA" },
        { id: "s8o_vsl", label: "3 VSL sections", rows: 5, hint: "VSL section (problem/mechanism/proof/offer/objection/CTA) / Purpose / Core points" },
        { id: "s8o_salespage", label: "3 sales page sections", rows: 5, hint: "Section name / Purpose / Copy bullets" },
        { id: "s8o_booking", label: "3 booking page bullets", rows: 5, hint: "Book a call if you want to: [outcomes] / Avoid if: [bad-fit buyers]" }
      ]
    }
  ];

  /* Grouping for the Founder Message Bank summary page */
  var BANK_GROUPS = [
    { title: "Business Positioning", section: "s1", items: [
      { id: "s1o_sentence", label: "Positioning sentence" },
      { id: "s1o_buyer", label: "Specific buyer" },
      { id: "s1o_result", label: "Specific result" },
      { id: "s1o_pain", label: "Main pain / frustration" }
    ]},
    { title: "Founder Message Bank", section: "s2", items: [
      { id: "s2o_beliefs", label: "5 founder beliefs" },
      { id: "s2o_contrarian", label: "5 contrarian opinions" },
      { id: "s2o_wrong", label: "5 market misunderstandings" },
      { id: "s2o_ways", label: "5 wrong way vs right way angles" }
    ]},
    { title: "Buyer Pain Bank", section: "s3", items: [
      { id: "s3o_pain", label: "10 pain angles" },
      { id: "s3o_failed", label: "5 failed-attempt angles" },
      { id: "s3o_real", label: "5 real problem is not X it is Y angles" },
      { id: "s3o_cost", label: "5 cost-of-inaction angles" }
    ]},
    { title: "Proof Bank", section: "s4", items: [
      { id: "s4o_cases", label: "3 mini case studies" },
      { id: "s4o_points", label: "10 proof points" },
      { id: "s4o_testi", label: "5 testimonial-based content ideas" },
      { id: "s4o_ads", label: "5 proof-based ad angles" }
    ]},
    { title: "Objection Bank", section: "s5", items: [
      { id: "s5o_posts", label: "10 objection-handling posts" },
      { id: "s5o_retarget", label: "5 retargeting ad ideas" },
      { id: "s5o_email", label: "5 email nurture ideas" },
      { id: "s5o_calls", label: "5 sales call talking points" }
    ]},
    { title: "Mechanism Bank", section: "s6", items: [
      { id: "s6o_name", label: "Mechanism name" },
      { id: "s6o_steps", label: "3–7 process steps" },
      { id: "s6o_content", label: "5 mechanism content angles" },
      { id: "s6o_ads", label: "5 mechanism ad angles" }
    ]},
    { title: "Founder Story Bank", section: "s7", items: [
      { id: "s7o_story", label: "5 founder story posts" },
      { id: "s7o_authority", label: "5 authority posts" },
      { id: "s7o_lesson", label: "5 lesson-learned posts" },
      { id: "s7o_shift", label: "5 belief-shift posts" }
    ]},
    { title: "Asset Bank", section: "s8", items: [
      { id: "s8o_social", label: "10 LinkedIn/X post ideas" },
      { id: "s8o_shortform", label: "10 short-form video ideas" },
      { id: "s8o_aiads", label: "10 AI video ad angles" },
      { id: "s8o_retarget", label: "5 retargeting content ideas" },
      { id: "s8o_email", label: "5 email nurture ideas" },
      { id: "s8o_vsl", label: "3 VSL sections" },
      { id: "s8o_salespage", label: "3 sales page sections" },
      { id: "s8o_booking", label: "3 booking page bullets" }
    ]}
  ];

  var CREATE_BULLETS = [
    "A clear positioning sentence", "Founder beliefs", "Contrarian opinions", "Buyer pain angles",
    "Proof points", "Objection-handling content", "Your unique mechanism", "Founder story angles",
    "LinkedIn/X post ideas", "Short-form video ideas", "AI video ad angles", "Email nurture ideas",
    "VSL sections", "Sales page sections", "Booking page bullets"
  ];

  /* ---------------------------------------------------------
     STATE + STORAGE
     --------------------------------------------------------- */
  var state = { fields: {}, meta: { lastSaved: null } };
  var currentStep = "landing";
  var saveTimer = null;

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          state.fields = parsed.fields && typeof parsed.fields === "object" ? parsed.fields : {};
          state.meta = parsed.meta && typeof parsed.meta === "object" ? parsed.meta : { lastSaved: null };
        }
      }
    } catch (e) { console.warn("Could not load saved workbook:", e); }
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Could not save:", e); }
  }

  function hasSavedProgress() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!raw) return false;
    try {
      var p = JSON.parse(raw);
      if (!p || !p.fields) return false;
      for (var k in p.fields) { if (p.fields[k] && String(p.fields[k]).trim()) return true; }
    } catch (e) {}
    return false;
  }

  function val(id) { return state.fields[id] != null ? state.fields[id] : ""; }

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function qId(secId, idx) { return secId + "_q" + idx; }

  function formatTime(ts) {
    if (!ts) return "";
    var d = new Date(ts);
    return d.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
  }
  function todayStr() {
    return new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }
  function slug(s) {
    return String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  /* ---------- Completion logic ---------- */
  function isDetailsComplete() {
    return !!(val("d_name").trim() && val("d_business").trim());
  }
  // Returns "empty" | "partial" | "complete" for a section (based on output fields)
  function sectionStatus(section) {
    var filled = 0;
    section.outputs.forEach(function (o) { if (val(o.id).trim()) filled++; });
    if (filled === 0) return "empty";
    if (filled === section.outputs.length) return "complete";
    return "partial";
  }
  function completedUnits() {
    var c = isDetailsComplete() ? 1 : 0;
    SECTIONS.forEach(function (s) { if (sectionStatus(s) === "complete") c++; });
    return c;
  }
  function progressPct() { return Math.round((completedUnits() / 9) * 100); }

  /* ---------------------------------------------------------
     RENDER: LANDING
     --------------------------------------------------------- */
  function renderLanding() {
    var landing = $("#landing");
    var showContinue = hasSavedProgress();
    landing.innerHTML =
      '<img src="/assets/ai-video-systems-logo.png" alt="AI Video Systems" class="landing__logo" ' +
        'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';" />' +
      '<div class="landing__logo-fallback" style="display:none;">AI VIDEO SYSTEMS</div>' +
      '<span class="landing__eyebrow">The Founder Message Extraction Workbook</span>' +
      '<h1>Turn Your Founder Expertise Into <span class="accent">Content, Ads, Emails &amp; Sales Assets</span></h1>' +
      '<p class="landing__sub">Most founders have their best message trapped inside sales calls, DMs, client stories, ' +
        'voice notes, and scattered notes. This interactive workbook helps you extract it, organise it, and turn it into ' +
        'a usable Founder Message Bank.</p>' +
      '<div class="landing__cta">' +
        '<button class="btn btn--gold" id="startBtn" type="button">Start The Workbook</button>' +
        (showContinue ? '<button class="btn btn--ghost" id="continueBtn" type="button">Continue Saved Workbook</button>' : "") +
      '</div>' +
      '<div class="create">' +
        '<h2>What You’ll Create</h2>' +
        '<p>By the end you’ll walk away with a complete, reusable message bank:</p>' +
        '<ul class="create__grid">' +
          CREATE_BULLETS.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") +
        '</ul>' +
      '</div>';

    $("#startBtn").addEventListener("click", function () { enterApp("details"); });
    if (showContinue) {
      $("#continueBtn").addEventListener("click", function () {
        // Resume at first incomplete section, else summary
        var target = "details";
        if (isDetailsComplete()) {
          target = "summary";
          for (var i = 0; i < SECTIONS.length; i++) {
            if (sectionStatus(SECTIONS[i]) !== "complete") { target = SECTIONS[i].id; break; }
          }
        }
        enterApp(target);
      });
    }
  }

  function enterApp(step) {
    $("#landing").classList.add("hidden");
    $("#workbookApp").classList.remove("hidden");
    goTo(step);
  }
  function backToLanding() {
    $("#workbookApp").classList.add("hidden");
    $("#landing").classList.remove("hidden");
    currentStep = "landing";
    renderLanding();
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------
     RENDER: SIDEBAR
     --------------------------------------------------------- */
  function stepList() {
    var steps = [{ id: "details", label: "Your Details", num: "•" }];
    SECTIONS.forEach(function (s, i) { steps.push({ id: s.id, label: s.title, num: String(i + 1) }); });
    steps.push({ id: "summary", label: "Message Bank", num: "★" });
    return steps;
  }

  function dotClass(stepId) {
    if (stepId === "details") return isDetailsComplete() ? "is-complete" : "";
    if (stepId === "summary") return "";
    var sec = sectionById(stepId);
    if (!sec) return "";
    var st = sectionStatus(sec);
    return st === "complete" ? "is-complete" : (st === "partial" ? "is-partial" : "");
  }

  function renderSidebar() {
    var sb = $("#sidebar");
    var html = '<div class="sidebar__title">Workbook</div>';
    stepList().forEach(function (s) {
      html +=
        '<button class="nav-item ' + (currentStep === s.id ? "is-active" : "") + '" data-step="' + s.id + '" type="button">' +
          '<span class="nav-item__num">' + s.num + '</span>' +
          '<span class="nav-item__label">' + esc(s.label) + '</span>' +
          '<span class="nav-item__dot ' + dotClass(s.id) + '"></span>' +
        '</button>';
    });
    html +=
      '<div class="sidebar__tools">' +
        '<button class="btn btn--outline btn--sm btn--block" data-action="export">Download Backup JSON</button>' +
        '<button class="btn btn--outline btn--sm btn--block" data-action="import">Import Backup JSON</button>' +
        '<button class="btn btn--danger btn--sm btn--block" data-action="clear">Clear Workbook</button>' +
      '</div>';
    sb.innerHTML = html;

    Array.prototype.forEach.call(sb.querySelectorAll(".nav-item"), function (btn) {
      btn.addEventListener("click", function () { goTo(btn.getAttribute("data-step")); });
    });
    bindToolButtons(sb);
  }

  function bindToolButtons(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-action]"), function (btn) {
      var a = btn.getAttribute("data-action");
      btn.addEventListener("click", function () {
        if (a === "export") exportJSON();
        else if (a === "import") $("#importFile").click();
        else if (a === "clear") openClearModal();
      });
    });
  }

  function sectionById(id) {
    for (var i = 0; i < SECTIONS.length; i++) { if (SECTIONS[i].id === id) return SECTIONS[i]; }
    return null;
  }

  /* ---------------------------------------------------------
     RENDER: HEADER PROGRESS + SAVE STATUS
     --------------------------------------------------------- */
  function updateProgress() {
    var pct = progressPct();
    $("#progressFill").style.width = pct + "%";
    $("#progressPct").textContent = pct + "%";
    $("#progressBar").setAttribute("aria-valuenow", String(pct));
  }
  function setSaveStatus(status) {
    var el = $("#saveStatus");
    el.classList.remove("is-saved", "is-saving");
    if (status === "saving") { el.classList.add("is-saving"); el.textContent = "Saving…"; }
    else if (status === "saved") { el.classList.add("is-saved"); el.textContent = "Autosaved"; }
    else { el.textContent = "Ready"; }
    $("#saveTime").textContent = state.meta.lastSaved ? "Last saved: " + formatTime(state.meta.lastSaved) : "";
  }

  /* ---------------------------------------------------------
     RENDER: STEP CONTENT
     --------------------------------------------------------- */
  function goTo(step) {
    currentStep = step;
    renderSidebar();
    if (step === "details") renderDetails();
    else if (step === "summary") renderSummary();
    else renderSection(sectionById(step));
    updateProgress();
    setSaveStatus(state.meta.lastSaved ? "saved" : "");
    var c = $("#content");
    c.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navFooter(prevStep, nextStep, statusHtml) {
    return (
      '<div class="section-nav">' +
        (prevStep ? '<button class="btn btn--ghost" data-nav="' + prevStep + '" type="button">← Back</button>'
                  : '<button class="btn btn--ghost" data-nav="landing" type="button">← Home</button>') +
        '<div class="section-nav__right">' +
          '<button class="btn btn--outline" data-nav-save="1" type="button">Save Progress</button>' +
          (nextStep ? '<button class="btn btn--gold" data-nav="' + nextStep + '" type="button">Next →</button>' : "") +
        '</div>' +
      '</div>' +
      (statusHtml || "")
    );
  }

  function bindNav(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-nav]"), function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-nav");
        if (t === "landing") backToLanding(); else goTo(t);
      });
    });
    var saveBtn = root.querySelector("[data-nav-save]");
    if (saveBtn) saveBtn.addEventListener("click", function () { manualSave(); });
  }

  function fieldInput(f) {
    var v = val(f.id);
    var hint = f.hint ? '<span class="field__hint">' + esc(f.hint) + "</span>" : "";
    if (f.type === "text") {
      return '<div class="field"><label for="' + f.id + '">' + esc(f.label) + "</label>" + hint +
        '<input type="text" id="' + f.id + '" data-field="' + f.id + '" value="' + esc(v) + '" placeholder="' + esc(f.ph || "") + '" /></div>';
    }
    var rows = f.rows || 3;
    var tall = rows >= 6 ? " tall" : "";
    return '<div class="field"><label for="' + f.id + '">' + esc(f.label) + "</label>" + hint +
      '<textarea id="' + f.id + '" data-field="' + f.id + '" class="' + tall + '" rows="' + rows + '" placeholder="' + esc(f.ph || "") + '">' + esc(v) + "</textarea></div>";
  }

  /* ----- Details page ----- */
  function renderDetails() {
    var c = $("#content");
    c.innerHTML =
      '<div class="section-head">' +
        '<span class="section-head__eyebrow">Before You Begin</span>' +
        '<h1>Your Details</h1>' +
        '<p class="section-head__goal">These appear in your final summary, PDF, Markdown export, and backup file.</p>' +
      '</div>' +
      '<div class="card">' +
        '<div class="details-grid">' +
          DETAILS.fields.map(fieldInput).join("") +
        '</div>' +
      '</div>' +
      navFooter(null, "s1",
        '<p class="section-status ' + (isDetailsComplete() ? "is-complete" : "") + '">' +
          (isDetailsComplete() ? "✓ Details saved" : "Add your name and business name to continue building your bank.") +
        "</p>");
    bindNav(c);
  }

  /* ----- Section page ----- */
  function renderSection(section) {
    if (!section) return;
    var idx = SECTIONS.indexOf(section);
    var prevStep = idx === 0 ? "details" : SECTIONS[idx - 1].id;
    var nextStep = idx === SECTIONS.length - 1 ? "summary" : SECTIONS[idx + 1].id;

    var qCounter = 0;
    var groupsHtml = section.groups.map(function (g) {
      if (section.hideEmptyGroups && (!g.questions || g.questions.length === 0)) return "";
      var qs = g.questions.map(function (label) {
        qCounter++;
        return fieldInput({ id: qId(section.id, qCounter), label: qCounter + ". " + label, rows: 3 });
      }).join("");
      return '<div class="group"><h3 class="group__title">' + esc(g.title) + "</h3>" + qs + "</div>";
    }).join("");

    var outputsHtml = section.outputs.map(fieldInput).join("");
    var exampleHtml = section.example
      ? '<div class="example"><strong>Example</strong>' + esc(section.example) + "</div>"
      : "";

    var st = sectionStatus(section);
    var statusLabel = st === "complete" ? "✓ Section complete" : (st === "partial" ? "In progress" : "Not started");

    var c = $("#content");
    c.innerHTML =
      '<div class="section-head">' +
        '<span class="section-head__eyebrow">Section ' + (idx + 1) + " of 8</span>" +
        "<h1>" + esc(section.title) + "</h1>" +
        '<p class="section-head__goal">' + esc(section.goal) + "</p>" +
      "</div>" +
      '<div class="card card--lesson">' +
        '<div class="card__kicker">Lesson</div>' +
        "<h2>" + esc(section.lessonTitle) + "</h2>" +
        section.lesson.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      "</div>" +
      (groupsHtml ? '<div class="card">' + groupsHtml + "</div>" : "") +
      '<div class="card card--output">' +
        '<div class="bank-block__head" style="margin-bottom:6px;">' +
          "<h2>" + esc(section.outputTitle) + "</h2>" +
          '<button class="btn btn--outline btn--sm" data-copy-section="' + section.id + '" type="button">Copy this section</button>' +
        "</div>" +
        (section.outputHelp ? '<p class="output-help">' + esc(section.outputHelp) + "</p>" : "") +
        outputsHtml +
        exampleHtml +
      "</div>" +
      navFooter(prevStep, nextStep,
        '<p class="section-status ' + (st === "complete" ? "is-complete" : "") + '" data-section-status="' + section.id + '">' + statusLabel + "</p>") +
      mobileToolsHtml();

    bindNav(c);
    bindToolButtons(c);
    var copyBtn = c.querySelector("[data-copy-section]");
    if (copyBtn) copyBtn.addEventListener("click", function () { copySection(section.id); });
  }

  function mobileToolsHtml() {
    return '<div class="mobile-tools">' +
      '<button class="btn btn--outline btn--sm" data-action="export" type="button">Backup JSON</button>' +
      '<button class="btn btn--outline btn--sm" data-action="import" type="button">Import JSON</button>' +
      '<button class="btn btn--danger btn--sm" data-action="clear" type="button">Clear Workbook</button>' +
      '<button class="btn btn--ghost btn--sm" data-nav="summary" type="button">Message Bank</button>' +
      "</div>";
  }

  /* ----- Summary / Founder Message Bank ----- */
  function renderSummary() {
    var c = $("#content");
    var detailsDl =
      '<dl class="summary-details">' +
        "<dt>Name</dt><dd>" + esc(val("d_name") || "—") + "</dd>" +
        "<dt>Business</dt><dd>" + esc(val("d_business") || "—") + "</dd>" +
        "<dt>Website</dt><dd>" + esc(val("d_website") || "—") + "</dd>" +
        "<dt>Date created</dt><dd>" + esc(todayStr()) + "</dd>" +
      "</dl>";

    var blocks = BANK_GROUPS.map(function (grp) {
      var items = grp.items.map(function (it) {
        var v = val(it.id).trim();
        return '<div class="bank-item">' +
          '<div class="bank-item__label">' + esc(it.label) + "</div>" +
          '<div class="bank-item__value ' + (v ? "" : "is-empty") + '">' + (v ? esc(v) : "Not filled in yet") + "</div>" +
          "</div>";
      }).join("");
      return '<div class="card bank-block">' +
        '<div class="bank-block__head"><h2>' + esc(grp.title) + "</h2>" +
          '<button class="btn btn--outline btn--sm" data-copy-section="' + grp.section + '" type="button">Copy</button></div>' +
        items +
        "</div>";
    }).join("");

    c.innerHTML =
      '<div class="section-head">' +
        '<span class="section-head__eyebrow">The Payoff</span>' +
        "<h1>Founder Message Bank</h1>" +
        '<p class="section-head__goal">Your extracted message, organised and ready to turn into content, ads, emails and sales assets. Export it, copy it, and keep building from it.</p>' +
      "</div>" +
      '<div class="summary-toolbar">' +
        '<button class="btn btn--gold" data-action="pdf" type="button">Download PDF</button>' +
        '<button class="btn btn--outline" data-action="md" type="button">Download Markdown</button>' +
        '<button class="btn btn--outline" data-action="copyall" type="button">Copy All Output</button>' +
        '<button class="btn btn--outline" data-action="export" type="button">Backup JSON</button>' +
        '<button class="btn btn--outline" data-action="import" type="button">Import JSON</button>' +
        '<button class="btn btn--danger" data-action="clear" type="button">Start Again</button>' +
      "</div>" +
      '<div class="card">' + detailsDl + "</div>" +
      blocks +
      navFooter("s8", null, "");

    bindNav(c);
    bindToolButtons(c);
    Array.prototype.forEach.call(c.querySelectorAll("[data-copy-section]"), function (btn) {
      btn.addEventListener("click", function () { copySection(btn.getAttribute("data-copy-section")); });
    });
    var pdfBtn = c.querySelector('[data-action="pdf"]');
    if (pdfBtn) pdfBtn.addEventListener("click", downloadPDF);
    var mdBtn = c.querySelector('[data-action="md"]');
    if (mdBtn) mdBtn.addEventListener("click", downloadMarkdown);
    var copyAllBtn = c.querySelector('[data-action="copyall"]');
    if (copyAllBtn) copyAllBtn.addEventListener("click", copyAll);
  }

  /* ---------------------------------------------------------
     AUTOSAVE (event delegation, debounced 500ms)
     --------------------------------------------------------- */
  function onInput(e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var fid = t.getAttribute("data-field");
    if (!fid) return;
    state.fields[fid] = t.value;
    setSaveStatus("saving");
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      state.meta.lastSaved = Date.now();
      persist();
      setSaveStatus("saved");
      updateProgress();
      refreshLiveIndicators(fid);
    }, 500);
  }

  // Update sidebar dot + footer status for the current section without full re-render
  function refreshLiveIndicators(changedFieldId) {
    // sidebar dots
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (btn) {
      var step = btn.getAttribute("data-step");
      var dot = btn.querySelector(".nav-item__dot");
      if (!dot) return;
      dot.className = "nav-item__dot " + dotClass(step);
    });
    // footer status of current section
    if (currentStep && currentStep.charAt(0) === "s" && currentStep !== "summary") {
      var sec = sectionById(currentStep);
      if (sec) {
        var st = sectionStatus(sec);
        var statusEl = document.querySelector('[data-section-status="' + currentStep + '"]');
        if (statusEl) {
          statusEl.textContent = st === "complete" ? "✓ Section complete" : (st === "partial" ? "In progress" : "Not started");
          statusEl.classList.toggle("is-complete", st === "complete");
        }
      }
    }
    if (currentStep === "details") {
      // no live footer status needed beyond dot
    }
  }

  function manualSave() {
    if (saveTimer) clearTimeout(saveTimer);
    state.meta.lastSaved = Date.now();
    persist();
    setSaveStatus("saved");
    updateProgress();
    refreshLiveIndicators();
    toast("Progress saved.");
  }

  /* ---------------------------------------------------------
     COPY
     --------------------------------------------------------- */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); resolve();
      } catch (e) { reject(e); }
    });
  }

  function sectionOutputText(sectionId) {
    var grp = null;
    for (var i = 0; i < BANK_GROUPS.length; i++) { if (BANK_GROUPS[i].section === sectionId) { grp = BANK_GROUPS[i]; break; } }
    if (!grp) return "";
    var lines = ["## " + grp.title, ""];
    grp.items.forEach(function (it) {
      var v = val(it.id).trim();
      lines.push("### " + it.label);
      lines.push(v ? v : "(not filled in yet)");
      lines.push("");
    });
    return lines.join("\n").trim();
  }

  function copySection(sectionId) {
    copyToClipboard(sectionOutputText(sectionId)).then(function () { toast("Copied."); })
      .catch(function () { toast("Copy failed."); });
  }

  function fullBankText() {
    var out = [];
    out.push("THE FOUNDER MESSAGE BANK");
    out.push(val("d_business") || "");
    out.push("Prepared by: " + (val("d_name") || ""));
    out.push("Date: " + todayStr());
    out.push("");
    BANK_GROUPS.forEach(function (grp) {
      out.push(sectionOutputText(grp.section));
      out.push("");
    });
    return out.join("\n").trim();
  }

  function copyAll() {
    copyToClipboard(fullBankText()).then(function () { toast("Copied."); })
      .catch(function () { toast("Copy failed."); });
  }

  /* ---------------------------------------------------------
     MARKDOWN EXPORT (questions + answers + bank)
     --------------------------------------------------------- */
  function buildMarkdown() {
    var md = [];
    md.push("# The Founder Message Extraction Workbook");
    md.push("");
    md.push("**Business:** " + (val("d_business") || "—"));
    md.push("**Prepared by:** " + (val("d_name") || "—"));
    if (val("d_website").trim()) md.push("**Website:** " + val("d_website"));
    if (val("d_email").trim()) md.push("**Email:** " + val("d_email"));
    md.push("**Date created:** " + todayStr());
    md.push("");
    md.push("---");
    md.push("");

    SECTIONS.forEach(function (section, idx) {
      md.push("## Section " + (idx + 1) + ": " + section.title);
      md.push("");
      md.push("_" + section.goal + "_");
      md.push("");
      var qCounter = 0;
      section.groups.forEach(function (g) {
        if (section.hideEmptyGroups && (!g.questions || g.questions.length === 0)) return;
        if (g.questions.length === 0) return;
        md.push("### " + g.title);
        md.push("");
        g.questions.forEach(function (label) {
          qCounter++;
          var a = val(qId(section.id, qCounter)).trim();
          md.push("**" + qCounter + ". " + label + "**");
          md.push("");
          md.push(a ? a : "_(no answer)_");
          md.push("");
        });
      });
      md.push("### " + (section.outputTitle || "Outputs"));
      md.push("");
      section.outputs.forEach(function (o) {
        var v = val(o.id).trim();
        md.push("**" + o.label + "**");
        md.push("");
        md.push(v ? v : "_(not filled in yet)_");
        md.push("");
      });
      md.push("---");
      md.push("");
    });

    md.push("# Founder Message Bank");
    md.push("");
    BANK_GROUPS.forEach(function (grp) {
      md.push("## " + grp.title);
      md.push("");
      grp.items.forEach(function (it) {
        var v = val(it.id).trim();
        md.push("### " + it.label);
        md.push("");
        md.push(v ? v : "_(not filled in yet)_");
        md.push("");
      });
    });

    return md.join("\n");
  }

  function downloadBlob(content, filename, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function nameSuffix() {
    var s = slug(val("d_business")) || slug(val("d_name"));
    return s ? "-" + s : "";
  }

  function downloadMarkdown() {
    var fn = "founder-message-bank" + nameSuffix() + ".md";
    downloadBlob(buildMarkdown(), fn, "text/markdown;charset=utf-8");
    toast("Markdown downloaded.");
  }

  /* ---------------------------------------------------------
     JSON BACKUP EXPORT / IMPORT
     --------------------------------------------------------- */
  function exportJSON() {
    var payload = JSON.stringify(state, null, 2);
    downloadBlob(payload, "founder-message-workbook-backup.json", "application/json");
    toast("Backup downloaded.");
  }

  function handleImportFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        // Rough validation
        if (!parsed || typeof parsed !== "object" || !parsed.fields || typeof parsed.fields !== "object") {
          throw new Error("Invalid backup file.");
        }
        state.fields = parsed.fields;
        state.meta = (parsed.meta && typeof parsed.meta === "object") ? parsed.meta : { lastSaved: Date.now() };
        state.meta.lastSaved = Date.now();
        persist();
        // Refresh UI
        if ($("#workbookApp").classList.contains("hidden")) enterApp("details");
        else goTo(currentStep === "landing" ? "details" : currentStep);
        toast("Backup imported successfully.");
      } catch (e) {
        alert("Import failed: this does not look like a valid workbook backup file.");
      }
    };
    reader.onerror = function () { alert("Could not read the file."); };
    reader.readAsText(file);
  }

  /* ---------------------------------------------------------
     CLEAR WORKBOOK (with confirmation modal)
     --------------------------------------------------------- */
  function openClearModal() {
    var root = $("#modalRoot");
    root.innerHTML =
      '<div class="modal-overlay" id="clearOverlay">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="clearTitle">' +
          '<h3 id="clearTitle">Clear this workbook?</h3>' +
          '<p>This permanently deletes your browser-saved progress for this workbook on this device. ' +
             'This cannot be undone. Consider downloading a Backup JSON first.</p>' +
          '<div class="modal__actions">' +
            '<button class="btn btn--ghost" id="clearCancel" type="button">Cancel</button>' +
            '<button class="btn btn--gold" id="clearBackup" type="button">Download Backup</button>' +
            '<button class="btn btn--danger" id="clearConfirm" type="button">Delete Everything</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    var close = function () { root.innerHTML = ""; };
    $("#clearCancel").addEventListener("click", close);
    $("#clearOverlay").addEventListener("click", function (e) { if (e.target.id === "clearOverlay") close(); });
    $("#clearBackup").addEventListener("click", exportJSON);
    $("#clearConfirm").addEventListener("click", function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      state = { fields: {}, meta: { lastSaved: null } };
      close();
      backToLanding();
      toast("Workbook cleared.");
    });
  }

  /* ---------------------------------------------------------
     PDF EXPORT (html2pdf, completed workbook, print-friendly)
     --------------------------------------------------------- */
  function buildPdfNode() {
    var stage = document.createElement("div");
    stage.className = "pdf-stage";

    var html = '<div class="pdf-doc">';
    html +=
      '<div class="pdf-header">' +
        '<div class="pdf-brand">AI Video Systems</div>' +
        "<h1>The Founder Message Extraction Workbook</h1>" +
        '<div class="pdf-meta">' +
          "<strong>Prepared by:</strong> " + esc(val("d_name") || "—") + " &nbsp;|&nbsp; " +
          "<strong>Business:</strong> " + esc(val("d_business") || "—") + "<br/>" +
          (val("d_website").trim() ? "<strong>Website:</strong> " + esc(val("d_website")) + " &nbsp;|&nbsp; " : "") +
          (val("d_email").trim() ? "<strong>Email:</strong> " + esc(val("d_email")) + " &nbsp;|&nbsp; " : "") +
          "<strong>Date created:</strong> " + esc(todayStr()) +
        "</div>" +
      "</div>";

    // Sections: questions + answers + outputs
    SECTIONS.forEach(function (section, idx) {
      html += '<div class="pdf-section">';
      html += "<h2>Section " + (idx + 1) + ": " + esc(section.title) + "</h2>";
      html += '<p class="pdf-goal">' + esc(section.goal) + "</p>";
      var qCounter = 0;
      section.groups.forEach(function (g) {
        if (!g.questions || g.questions.length === 0) return;
        g.questions.forEach(function (label) {
          qCounter++;
          var a = val(qId(section.id, qCounter)).trim();
          if (!a) return; // PDF = completed workbook: skip blanks to keep it clean
          html += '<div class="pdf-qa"><div class="pdf-q">' + qCounter + ". " + esc(label) + "</div>" +
                  '<div class="pdf-a">' + esc(a) + "</div></div>";
        });
      });
      // outputs
      var anyOut = section.outputs.some(function (o) { return val(o.id).trim(); });
      if (anyOut) {
        html += '<div class="pdf-outputs"><h3>' + esc(section.outputTitle || "Outputs") + "</h3>";
        section.outputs.forEach(function (o) {
          var v = val(o.id).trim();
          if (!v) return;
          html += '<div class="pdf-out"><div class="pdf-out-label">' + esc(o.label) + "</div>" +
                  '<div class="pdf-out-val">' + esc(v) + "</div></div>";
        });
        html += "</div>";
      }
      html += "</div>";
    });

    // Final Founder Message Bank
    html += '<div class="pdf-divider"></div>';
    html += '<div class="pdf-bank">';
    html += '<div class="pdf-section"><h2>Founder Message Bank</h2></div>';
    BANK_GROUPS.forEach(function (grp) {
      var anyVal = grp.items.some(function (it) { return val(it.id).trim(); });
      html += '<div class="pdf-section"><h2>' + esc(grp.title) + "</h2>";
      if (!anyVal) {
        html += '<div class="pdf-out"><div class="pdf-out-val">(not filled in yet)</div></div>';
      } else {
        grp.items.forEach(function (it) {
          var v = val(it.id).trim();
          if (!v) return;
          html += '<div class="pdf-out"><div class="pdf-out-label">' + esc(it.label) + "</div>" +
                  '<div class="pdf-out-val">' + esc(v) + "</div></div>";
        });
      }
      html += "</div>";
    });
    html += "</div>";

    html += "</div>";
    stage.innerHTML = html;
    return stage;
  }

  function downloadPDF() {
    if (typeof window.html2pdf === "undefined") {
      alert("The PDF library is still loading (or blocked). Check your connection and try again.");
      return;
    }
    var suffix = nameSuffix();
    var filename = "founder-message-extraction-workbook" + suffix + ".pdf";
    var node = buildPdfNode();
    document.body.appendChild(node);
    toast("Building PDF…");
    var opt = {
      margin: [10, 0, 12, 0],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true, windowWidth: 794 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "avoid-all"] }
    };
    window.html2pdf().set(opt).from(node.querySelector(".pdf-doc")).save()
      .then(function () { if (node.parentNode) node.parentNode.removeChild(node); toast("PDF downloaded."); })
      .catch(function (err) {
        console.error(err);
        if (node.parentNode) node.parentNode.removeChild(node);
        toast("PDF failed — try again.");
      });
  }

  /* ---------------------------------------------------------
     TOAST
     --------------------------------------------------------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  function init() {
    loadState();
    renderLanding();

    // Global input listener (event delegation across whole app)
    document.addEventListener("input", onInput);

    // Brand logo -> home
    $("#brandHome").addEventListener("click", backToLanding);

    // Import file input
    $("#importFile").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (file) handleImportFile(file);
      e.target.value = ""; // allow re-import of same file
    });

    // Escape closes modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { var r = $("#modalRoot"); if (r.innerHTML) r.innerHTML = ""; }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
