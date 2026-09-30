---
title: "Agency Break-Even Calculator"
metaTitle: "Agency Break-Even Calculator for Service Businesses | AVS"
slug: tools/agency-break-even-calculator
kind: tool
group: tools
tag: "Free Tool"
description: "A free calculator that shows how many extra customers a lead generation agency must win you to pay back its fee, and the uplift that implies on your current ad results."
h1: "Agency Break-Even Calculator: How Many Extra Customers Does the Fee Need?"
subhead: "Enter your numbers. See the customers an agency must add to pay for itself. Nothing is stored or sent."
date: 2026-09-30
updated: 2026-09-30
parent:
  label: Tools
  href: /tools
faqs:
  - q: "How do I calculate whether an agency will pay for itself?"
    a: "Divide the agency's monthly fee by the first-year gross profit of one customer. The answer is the number of extra customers per month the agency must add to cover its fee. Ad spend is separate and already produces some customers today."
  - q: "Which customer value should I use?"
    a: "Gross profit from a new customer in their first year, after the direct cost of delivering the work, not revenue. If you're unsure, use a conservative figure."
  - q: "Does this include ad spend?"
    a: "Ad spend is shown separately. The break-even for the fee assumes your current ad spend keeps producing today's customers. The total-cost line shows fee plus ad spend against all customers."
  - q: "Is this a prediction of what an agency will deliver?"
    a: "No. It shows what would have to be true for the fee to pay back. Whether an agency can deliver that depends on your follow-up, offer and the agency itself."
  - q: "What does AI Video Systems charge?"
    a: "We don't publish a price, because it depends on your ad spend, what a customer is worth to you and your capacity. Use this calculator with any quote, ours included, and we'll run it on your numbers on the free call."
related:
  - label: "Is a $5,000-a-month agency worth it?"
    href: "/guides/is-5000-a-month-lead-generation-agency-worth-it"
    desc: "The reasoning behind this calculator."
  - label: "Cost per customer calculator"
    href: "/tools/cost-per-customer-calculator"
    desc: "Turn cost per lead into cost per customer."
  - label: "What's a normal setup fee and retainer?"
    href: "/guides/agency-setup-fee-and-monthly-retainer"
    desc: "What each fee line should buy."
---

This calculator shows how many extra customers per month a lead generation agency must add for its fee to pay back, given what one customer is worth to you. If a $5,000 fee meets a customer worth $4,000 in first-year gross profit, the agency needs 1.25 extra customers a month. Enter your own numbers below.

## Calculate your break-even

<div class="tool" id="be-tool">
<label for="be-fee">Agency fee per month ($)</label>
<input id="be-fee" type="number" min="0" step="100" value="5000" inputmode="decimal" />
<label for="be-spend">Ad spend per month ($)</label>
<input id="be-spend" type="number" min="0" step="100" value="5000" inputmode="decimal" />
<label for="be-value">First-year gross profit per new customer ($)</label>
<input id="be-value" type="number" min="1" step="100" value="4000" inputmode="decimal" />
<label for="be-cur">Customers your ads produce per month today</label>
<input id="be-cur" type="number" min="0" step="1" value="2" inputmode="decimal" />
<div class="out" id="be-out" aria-live="polite"></div>
<small>Estimates only. Excludes your own sales time, software and tax.</small>
</div>
<script>
(function(){
function g(id){var v=parseFloat(document.getElementById(id).value);return isFinite(v)?v:0}
function m(n){return '$'+Math.round(n).toLocaleString('en-US')}
function d(n){return (Math.round(n*100)/100).toLocaleString('en-US')}
function run(){
var F=g('be-fee'),S=g('be-spend'),V=g('be-value'),C=g('be-cur');
var out=document.getElementById('be-out');
if(V<=0){out.innerHTML='<p>Enter a customer value above zero.</p>';return}
var need=F/V,total=(F+S)/V,html='';
html+='<p>Extra customers needed per month to cover the fee: <span class="big">'+d(need)+'</span></p>';
html+='<p>Customers needed to cover fee plus ad spend: <strong>'+d(total)+'</strong> a month</p>';
if(C>0){
html+='<p>Uplift on today&rsquo;s '+d(C)+' customers a month: <strong>'+d(need/C*100)+'%</strong></p>';
html+='<p>Cost per customer today (ad spend only): <strong>'+m(S/C)+'</strong></p>';
html+='<p>Cost per customer at break-even (fee plus ad spend): <strong>'+m((F+S)/(C+need))+'</strong></p>';
}
out.innerHTML=html;
}
['be-fee','be-spend','be-value','be-cur'].forEach(function(id){document.getElementById(id).addEventListener('input',run)});
run();
})();
</script>

## Worked example

A service business pays an agency $5,000 a month and spends $5,000 a month on ads. One new customer is worth $4,000 in first-year gross profit, and the ads produce 2 customers a month today.

- **Customers needed to cover the fee:** $5,000 ÷ $4,000 = 1.25 extra customers a month.
- **Customers needed to cover fee plus ad spend:** $10,000 ÷ $4,000 = 2.5 a month.
- **Uplift needed on today's results:** 1.25 ÷ 2 = 62.5%.
- **Cost per customer today (ad spend only):** $5,000 ÷ 2 = $2,500.
- **Cost per customer at break-even:** $10,000 ÷ 3.25 = about $3,077.

Read that last line carefully: at break-even, each customer costs more than before, because the fee is now in the total. The agency only earns its place if it goes beyond break-even, and that's where follow-up speed, qualification and trust before the click decide the result.

## Methodology

- **Extra customers to cover the fee** = agency fee ÷ first-year gross profit per customer.
- **Customers to cover fee plus ad spend** = (fee + ad spend) ÷ first-year gross profit per customer.
- **Uplift** = extra customers needed ÷ customers produced per month today.
- **Cost per customer at break-even** = (fee + ad spend) ÷ (today's customers + extra customers needed).

All values come from you. The calculator has no defaults from outside data, and the pre-filled figures are only the worked example. It doesn't account for sales time, software costs, refunds, repeat purchases beyond the first year or tax. The fee-only break-even treats today's ad spend as already justified by today's customers; the fee-plus-ad-spend line is the stricter test. A longer customer lifetime would lower the break-even, so use first-year gross profit if you want a conservative answer.

## What next?

If the uplift needed looks plausible against your follow-up speed and close rate, the fee can pay back. If it needs a doubling you can't explain, look at where enquiries leak first: [why leads go cold](/guides/why-facebook-ad-leads-go-cold) and [the revenue chain](/blog/leads-but-no-sales). To run this on your own numbers, [Book A Free Call](https://calendly.com/sean_munn/seanspersonallink).
