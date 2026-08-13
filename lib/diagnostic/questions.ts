import type { ScoredQuestion } from './types';

// The 28 scored diagnostic questions. Wording, ids and score mappings follow the
// approved question bank exactly. Do not change ids without bumping CONTENT_VERSION
// and SCORING_VERSION, and never overwrite historical raw answers when they do change.

export const SCORED_QUESTIONS: ScoredQuestion[] = [
  // --- Category 1: Acquisition Economics and Scalability ---
  {
    id: 'a1',
    code: 'A1',
    categoryKey: 'acquisition',
    prompt: 'What usually happens when you materially increase paid-acquisition spend?',
    options: [
      { id: 'a1_0', label: 'Costs rise sharply and completed plan sales do not keep pace', score: 0 },
      { id: 'a1_25a', label: 'Cost per lead rises, but we cannot reliably see what happens to CAC', score: 25 },
      { id: 'a1_50', label: 'Results vary; some increases hold and others deteriorate', score: 50 },
      { id: 'a1_75', label: 'Controlled increases usually maintain acceptable CPL and CAC', score: 75 },
      {
        id: 'a1_100',
        label: 'We have repeatedly scaled at higher spend while maintaining validated plan-sale economics',
        score: 100,
      },
      { id: 'a1_unknown', label: 'We have not tested this or do not know', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'a2',
    code: 'A2',
    categoryKey: 'acquisition',
    prompt: 'How accurately can you state the maximum CAC the business can afford?',
    options: [
      { id: 'a2_0', label: 'We cannot state it', score: 0 },
      { id: 'a2_25', label: 'We have an informal estimate', score: 25 },
      { id: 'a2_50', label: 'We calculate it from average revenue', score: 50 },
      { id: 'a2_75', label: 'We calculate it from contribution margin and commercial targets', score: 75 },
      {
        id: 'a2_100',
        label: 'It is validated using actual plan mix, payment behaviour, cancellations and contribution data',
        score: 100,
      },
      { id: 'a2_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'a3',
    code: 'A3',
    categoryKey: 'acquisition',
    prompt: 'What primarily determines whether a campaign is scaled, held or stopped?',
    options: [
      { id: 'a3_0', label: 'Instinct, cash availability or short-term lead volume', score: 0 },
      { id: 'a3_25', label: 'Cost per lead alone', score: 25 },
      { id: 'a3_50', label: 'A mixture of lead cost, lead quality and contact metrics', score: 50 },
      { id: 'a3_75', label: 'Cost per completed plan and downstream conversion', score: 75 },
      { id: 'a3_100', label: 'Cohort-level profit, capacity and source-to-sale performance', score: 100 },
      { id: 'a3_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'a4',
    code: 'A4',
    categoryKey: 'acquisition',
    prompt: "How well is the company's next level of acquisition volume modelled?",
    options: [
      { id: 'a4_0', label: 'We do not know what volume the current operation can support', score: 0 },
      { id: 'a4_25', label: 'We have a rough sense but no model', score: 25 },
      { id: 'a4_50', label: 'We have targets for leads and sales but limited sensitivity planning', score: 50 },
      { id: 'a4_75', label: 'We model CPL, conversion, CAC and capacity before major increases', score: 75 },
      {
        id: 'a4_100',
        label: 'We use conservative, base and upside scenarios and update them with actual results',
        score: 100,
      },
      { id: 'a4_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },

  // --- Category 2: Creative and Channel Resilience ---
  {
    id: 'c1',
    code: 'C1',
    categoryKey: 'resilience',
    prompt: 'Approximately how dependent are current paid results on the top one or two adverts?',
    options: [
      { id: 'c1_0', label: 'More than 75% of results', score: 0 },
      { id: 'c1_25', label: '51–75%', score: 25 },
      { id: 'c1_50', label: '31–50%', score: 50 },
      { id: 'c1_75', label: '11–30%', score: 75 },
      { id: 'c1_100', label: '10% or less, with several reliable performers', score: 100 },
      { id: 'c1_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
      {
        id: 'c1_no_ads',
        label: 'We do not currently run paid adverts',
        score: 0,
        uncertaintyFlag: true,
      },
    ],
  },
  {
    id: 'c2',
    code: 'C2',
    categoryKey: 'resilience',
    prompt: 'How often is new creative deliberately researched, produced and tested?',
    options: [
      { id: 'c2_0', label: 'Only after performance declines', score: 0 },
      { id: 'c2_25', label: 'Every two or three months', score: 25 },
      { id: 'c2_50', label: 'Approximately monthly', score: 50 },
      { id: 'c2_75', label: 'At least every two weeks', score: 75 },
      { id: 'c2_100', label: 'Through a continuous weekly testing and learning cycle', score: 100 },
      { id: 'c2_none', label: 'We do not currently test paid creative', score: 0 },
    ],
  },
  {
    id: 'c3',
    code: 'C3',
    categoryKey: 'resilience',
    prompt: 'If the current best advert failed tomorrow, what is ready to replace it?',
    options: [
      { id: 'c3_0', label: 'Nothing', score: 0 },
      { id: 'c3_25', label: 'Ideas exist, but nothing has been produced', score: 25 },
      { id: 'c3_50', label: 'One or two unproven alternatives', score: 50 },
      { id: 'c3_75', label: 'Several tested alternatives with useful signals', score: 75 },
      { id: 'c3_100', label: 'A rolling pipeline of proven messages, formats and replacements', score: 100 },
      { id: 'c3_none', label: 'We do not currently have an active advert', score: 0 },
    ],
  },
  {
    id: 'c4',
    code: 'C4',
    categoryKey: 'resilience',
    prompt: 'What percentage of new-plan acquisition depends on the single largest channel or supplier?',
    options: [
      { id: 'c4_0', label: '90% or more', score: 0 },
      { id: 'c4_25', label: '70–89%', score: 25 },
      { id: 'c4_50', label: '50–69%', score: 50 },
      { id: 'c4_75', label: 'One channel leads, but other repeatable sources exist', score: 75 },
      { id: 'c4_100', label: 'Several commercially dependable sources contribute meaningful volume', score: 100 },
      { id: 'c4_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },

  // --- Category 3: Lead Quality and Buyer Readiness ---
  {
    id: 'l1',
    code: 'L1',
    categoryKey: 'readiness',
    prompt: 'When reviewing the last 20 enquiries, how many clearly remembered the message or advert that prompted them?',
    options: [
      { id: 'l1_0', label: 'Almost none', score: 0 },
      { id: 'l1_25', label: 'Fewer than one in four', score: 25 },
      { id: 'l1_50', label: 'Approximately half', score: 50 },
      { id: 'l1_75', label: 'Most', score: 75 },
      { id: 'l1_100', label: 'Nearly all, and this is tracked by source', score: 100 },
      { id: 'l1_unknown', label: 'Not measured', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'l2',
    code: 'L2',
    categoryKey: 'readiness',
    prompt: 'How often do new enquiries understand why the company is contacting them and expect the first call?',
    options: [
      { id: 'l2_0', label: 'They frequently deny or forget the enquiry', score: 0 },
      { id: 'l2_25', label: 'Recognition is inconsistent', score: 25 },
      { id: 'l2_50', label: 'About half expect and understand the contact', score: 50 },
      { id: 'l2_75', label: 'Most expect contact and understand the reason', score: 75 },
      {
        id: 'l2_100',
        label: 'Expectation is intentionally created, acknowledged immediately and verified',
        score: 100,
      },
      { id: 'l2_unknown', label: 'Not measured', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'l3',
    code: 'L3',
    categoryKey: 'readiness',
    prompt: 'How prepared is the average prospect before speaking with an adviser?',
    options: [
      { id: 'l3_0', label: 'Cold, unfamiliar and unclear about funeral plans', score: 0 },
      { id: 'l3_25', label: 'Aware of the basic topic but lacking trust or understanding', score: 25 },
      { id: 'l3_50', label: 'Understands the basic proposition but still needs substantial education', score: 50 },
      { id: 'l3_75', label: 'Has seen relevant explanations, proof and common-objection content', score: 75 },
      {
        id: 'l3_100',
        label: 'Arrives informed, brand-aware and ready for a relevant options conversation',
        score: 100,
      },
      { id: 'l3_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'l4',
    code: 'L4',
    categoryKey: 'readiness',
    prompt: 'How is lead quality fed back into marketing decisions?',
    options: [
      { id: 'l4_0', label: 'It is not', score: 0 },
      { id: 'l4_25', label: 'Advisers give anecdotal complaints or praise', score: 25 },
      { id: 'l4_50', label: 'Basic quality notes are captured inconsistently', score: 50 },
      { id: 'l4_75', label: 'Contact, qualification and objections are reviewed by source', score: 75 },
      {
        id: 'l4_100',
        label: 'Sales outcomes and call insights systematically change targeting, forms, messages and creative',
        score: 100,
      },
      { id: 'l4_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },

  // --- Category 4: Contact and Lead-to-Plan Performance ---
  {
    id: 'p1',
    code: 'P1',
    categoryKey: 'performance',
    prompt: 'How quickly does the first genuine human contact attempt normally occur?',
    options: [
      { id: 'p1_0', label: 'More than 24 hours', score: 0 },
      { id: 'p1_25', label: 'Four to 24 hours', score: 25 },
      { id: 'p1_50', label: 'One to four hours', score: 50 },
      { id: 'p1_75', label: '15 to 60 minutes', score: 75 },
      { id: 'p1_100', label: 'Within 15 minutes, with performance monitored', score: 100 },
      { id: 'p1_unknown', label: 'Not measured', score: 0, uncertaintyFlag: true },
    ],
  },
  {
    id: 'p2',
    code: 'P2',
    categoryKey: 'performance',
    prompt: 'What happens during the first few minutes after a new enquiry arrives?',
    options: [
      { id: 'p2_0', label: 'There is no reliable acknowledgement or ownership', score: 0 },
      { id: 'p2_25', label: 'Ownership is manual or inconsistent', score: 25 },
      { id: 'p2_50', label: 'An automated acknowledgement is sent, but adviser ownership varies', score: 50 },
      { id: 'p2_75', label: 'Immediate acknowledgement and clear adviser assignment are standard', score: 75 },
      {
        id: 'p2_100',
        label: 'Acknowledgement, ownership, escalation and first-contact timing are all monitored',
        score: 100,
      },
      { id: 'p2_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'p3',
    code: 'P3',
    categoryKey: 'performance',
    prompt: 'How structured is follow-up when a new lead does not answer or buy immediately?',
    options: [
      { id: 'p3_0', label: 'One or two attempts, then little happens', score: 0 },
      { id: 'p3_25', label: 'Several attempts over approximately one week', score: 25 },
      { id: 'p3_50', label: 'Multi-channel follow-up continues for two to four weeks', score: 50 },
      { id: 'p3_75', label: 'Structured follow-up continues across 30–90 days', score: 75 },
      {
        id: 'p3_100',
        label: 'Behaviour- or status-based nurture continues until a valid outcome or opt-out',
        score: 100,
      },
      { id: 'p3_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'p4',
    code: 'P4',
    categoryKey: 'performance',
    prompt: 'How completely is the journey from enquiry to completed plan recorded?',
    options: [
      { id: 'p4_0', label: 'There are no dependable stages', score: 0 },
      { id: 'p4_25', label: 'A few broad statuses exist', score: 25 },
      { id: 'p4_50', label: 'Core stages exist but updates are inconsistent', score: 50 },
      { id: 'p4_75', label: 'Contact, qualification, quote, follow-up and sale stages are usually complete', score: 75 },
      { id: 'p4_100', label: 'Stages are defined, audited and used to manage performance', score: 100 },
      { id: 'p4_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },

  // --- Category 5: Existing Enquiry Monetisation ---
  {
    id: 'e1',
    code: 'E1',
    categoryKey: 'existing',
    prompt: 'Can the business state how many unconverted enquiries are 30, 60, 90 and 180+ days old?',
    options: [
      { id: 'e1_0', label: 'No', score: 0 },
      { id: 'e1_25', label: 'Only through a manual one-off exercise', score: 25 },
      { id: 'e1_50', label: 'Broad aged counts are available', score: 50 },
      { id: 'e1_75', label: 'Counts are visible by age and meaningful status', score: 75 },
      { id: 'e1_100', label: 'Counts, value, ownership and outcomes are continuously visible', score: 100 },
      { id: 'e1_unknown', label: 'Not sure', score: 0, uncertaintyFlag: true },
    ],
  },
  {
    id: 'e2',
    code: 'E2',
    categoryKey: 'existing',
    prompt: 'How well are older enquiries segmented?',
    options: [
      { id: 'e2_0', label: 'They remain in one undifferentiated database', score: 0 },
      { id: 'e2_25', label: 'A few broad labels exist', score: 25 },
      { id: 'e2_50', label: 'They are separated by status or age', score: 50 },
      { id: 'e2_75', label: 'They are segmented by status, reason, timing and plan interest', score: 75 },
      { id: 'e2_100', label: 'Segmentation actively determines relevant follow-up and reactivation', score: 100 },
      { id: 'e2_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'e3',
    code: 'E3',
    categoryKey: 'existing',
    prompt: 'What happens to an enquiry that does not buy during the initial sales period?',
    options: [
      { id: 'e3_0', label: 'It largely disappears from active communication', score: 0 },
      { id: 'e3_25', label: 'Occasional generic follow-up', score: 25 },
      { id: 'e3_50', label: 'A basic email or SMS sequence', score: 50 },
      { id: 'e3_75', label: 'Long-term educational nurture and periodic adviser follow-up', score: 75 },
      {
        id: 'e3_100',
        label: 'Personalised, consented nurture and trigger-based reactivation are systematically managed',
        score: 100,
      },
      { id: 'e3_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'e4',
    code: 'E4',
    categoryKey: 'existing',
    prompt: 'Can the business measure completed plan sales originating from older or reactivated enquiries?',
    options: [
      { id: 'e4_0', label: 'No', score: 0 },
      { id: 'e4_25', label: 'Only through anecdotes', score: 25 },
      { id: 'e4_50', label: 'Some reactivated sales can be identified manually', score: 50 },
      { id: 'e4_75', label: 'Reactivation sales and revenue are reported regularly', score: 75 },
      {
        id: 'e4_100',
        label: 'Reactivation performance is measured by segment, campaign, cost and commercial return',
        score: 100,
      },
      { id: 'e4_unknown', label: 'Not sure', score: 0, uncertaintyFlag: true },
    ],
  },

  // --- Category 6: Revenue Visibility ---
  {
    id: 'r1',
    code: 'R1',
    categoryKey: 'visibility',
    prompt: 'Can a completed plan sale be connected to its original channel, campaign and advert?',
    options: [
      { id: 'r1_0', label: 'Almost never', score: 0 },
      { id: 'r1_25', label: 'Channel only', score: 25 },
      { id: 'r1_50', label: 'Campaign for some sales', score: 50 },
      { id: 'r1_75', label: 'Campaign and advert for most sales', score: 75 },
      { id: 'r1_100', label: 'Reliably connected across nearly all sales with documented exceptions', score: 100 },
      { id: 'r1_unknown', label: 'Not sure', score: 0, uncertaintyFlag: true },
    ],
  },
  {
    id: 'r2',
    code: 'R2',
    categoryKey: 'visibility',
    prompt: 'Which performance level is reviewed most consistently?',
    options: [
      { id: 'r2_0', label: 'Spend and lead volume', score: 0 },
      { id: 'r2_25', label: 'Cost per lead', score: 25 },
      { id: 'r2_50', label: 'Contact, quote and lead-quality metrics', score: 50 },
      { id: 'r2_75', label: 'Completed plan sales and CAC', score: 75 },
      { id: 'r2_100', label: 'Contribution or profit by source, cohort and creative', score: 100 },
      { id: 'r2_unknown', label: 'Not sure', score: 0, uncertaintyFlag: true },
    ],
  },
  {
    id: 'r3',
    code: 'R3',
    categoryKey: 'visibility',
    prompt: 'How reliable is CRM status and outcome data?',
    options: [
      { id: 'r3_0', label: 'It cannot be trusted', score: 0 },
      { id: 'r3_25', label: 'Large gaps and inconsistent definitions exist', score: 25 },
      { id: 'r3_50', label: 'Broadly useful but incomplete', score: 50 },
      { id: 'r3_75', label: 'Usually accurate with agreed definitions', score: 75 },
      { id: 'r3_100', label: 'Audited, reconciled and dependable for commercial decisions', score: 100 },
      { id: 'r3_unknown', label: 'Not sure', score: 0, uncertaintyFlag: true },
    ],
  },
  {
    id: 'r4',
    code: 'R4',
    categoryKey: 'visibility',
    prompt: 'How well does reporting account for the longer funeral-plan decision cycle?',
    options: [
      { id: 'r4_0', label: 'Leads are judged almost entirely on immediate outcomes', score: 0 },
      { id: 'r4_25', label: 'Some delayed sales are noticed but not analysed', score: 25 },
      { id: 'r4_50', label: 'Monthly reporting includes older conversions in broad terms', score: 50 },
      { id: 'r4_75', label: 'Cohorts are followed beyond the initial sales window', score: 75 },
      {
        id: 'r4_100',
        label: 'Time-to-sale and delayed conversion are built into CAC and channel decisions',
        score: 100,
      },
      { id: 'r4_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },

  // --- Category 7: Growth Capacity and Founder Independence ---
  {
    id: 'g1',
    code: 'G1',
    categoryKey: 'capacity',
    prompt: 'If lead volume doubled next month, what would happen?',
    options: [
      { id: 'g1_0', label: 'Enquiries would be missed and service would deteriorate', score: 0 },
      { id: 'g1_25', label: 'Significant delays and inconsistency would appear', score: 25 },
      { id: 'g1_50', label: 'The team could cope temporarily but not sustainably', score: 50 },
      { id: 'g1_75', label: 'The business has sufficient documented short-term capacity', score: 75 },
      { id: 'g1_100', label: 'Capacity, staffing, routing and service levels are modelled and ready', score: 100 },
      { id: 'g1_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'g2',
    code: 'G2',
    categoryKey: 'capacity',
    prompt: 'How consistently do advisers follow the required lead-handling process?',
    options: [
      { id: 'g2_0', label: 'No consistent process exists', score: 0 },
      { id: 'g2_25', label: 'Performance depends largely on the individual', score: 25 },
      { id: 'g2_50', label: 'A process exists but compliance varies', score: 50 },
      { id: 'g2_75', label: 'Process and service levels are documented and usually followed', score: 75 },
      { id: 'g2_100', label: 'Compliance and outcomes are monitored, coached and improved', score: 100 },
      { id: 'g2_solo', label: 'The founder is the only seller and no independent process exists', score: 0 },
      { id: 'g2_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'g3',
    code: 'G3',
    categoryKey: 'capacity',
    prompt: 'How visible is adviser capacity and performance?',
    options: [
      { id: 'g3_0', label: 'It is mostly unknown', score: 0 },
      { id: 'g3_25', label: 'Underperformance becomes visible only after problems arise', score: 25 },
      { id: 'g3_50', label: 'Basic activity or sales totals are reviewed', score: 50 },
      { id: 'g3_75', label: 'Workload, contact, quote and conversion are visible by adviser', score: 75 },
      {
        id: 'g3_100',
        label: 'Capacity and performance data actively determine routing, hiring and coaching',
        score: 100,
      },
      { id: 'g3_solo', label: 'The founder is the only seller and personal capacity is not modelled', score: 0 },
      { id: 'g3_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
  {
    id: 'g4',
    code: 'G4',
    categoryKey: 'capacity',
    prompt: 'Could acquisition continue operating properly if the founder stepped away for 30 days?',
    options: [
      { id: 'g4_0', label: 'No; key activity would stop', score: 0 },
      { id: 'g4_25', label: 'Major decisions and fixes would wait for the founder', score: 25 },
      { id: 'g4_50', label: 'Day-to-day work would continue, but improvement would stall', score: 50 },
      { id: 'g4_75', label: 'A responsible owner and documented process could run it', score: 75 },
      {
        id: 'g4_100',
        label: 'The operation would continue, learn and improve without founder intervention',
        score: 100,
      },
      { id: 'g4_unknown', label: 'Not sure', score: 25, uncertaintyFlag: true },
    ],
  },
];

export const SCORED_QUESTION_MAP: Record<string, ScoredQuestion> = Object.fromEntries(
  SCORED_QUESTIONS.map((q) => [q.id, q])
);
