---
title: "Cost Per Customer Calculator"
metaTitle: "Cost Per Customer Calculator for Ad Spend | AVS"
slug: tools/cost-per-customer-calculator
kind: tool
group: tools
tag: "Free Tool"
description: "A free calculator that turns your ad spend, agency fee, leads and lead-to-customer rate into cost per lead and cost per customer, so you can see what your ads really cost per sale."
h1: "Cost Per Customer Calculator: What Do Your Ads Really Cost per Sale?"
subhead: "Cost per lead is what the dashboard shows. Cost per customer is what the business pays. Enter your numbers to see both."
date: 2026-09-30
updated: 2026-09-30
parent:
  label: Tools
  href: /tools
faqs:
  - q: "How do I calculate cost per customer from cost per lead?"
    a: "Divide cost per lead by the share of leads that become customers. A $40 lead that closes 4% of the time costs $1,000 per customer. Add any agency fee to the spend for the full figure."
  - q: "Should cost per customer include the agency fee?"
    a: "Yes. Cost per customer is everything you spend to win customers in a period, ad spend plus fees, divided by new customers. Ad-spend-only figures flatter the result."
  - q: "What lead-to-customer rate should I use?"
    a: "Your own, from your CRM: customers signed from a month's leads divided by those leads. If you don't know it, that's the first number to find."
  - q: "Why does the second scenario matter?"
    a: "It shows what a better lead-to-customer rate would do to cost per customer with spend held the same, which is usually the cheapest improvement available."
  - q: "Where can I learn more about this metric?"
    a: "Read cost per lead vs cost per customer, which explains why one is a diagnostic and the other a scoreboard."
related:
  - label: "Cost per lead vs cost per customer"
    href: "/blog/cpl-vs-cac"
    desc: "Why cost per customer is the metric to manage."
  - label: "Agency break-even calculator"
    href: "/tools/agency-break-even-calculator"
    desc: "How many extra customers does the fee need?"
  - label: "How to measure the real ROI of Facebook ads"
    href: "/guides/measure-real-roi-of-facebook-ads"
    desc: "The tracking behind these numbers."
---

Cost per customer is your ad spend plus any agency fee divided by the customers you actually won. With $5,000 of ad spend, a $5,000 fee, 125 leads and a 4% lead-to-customer rate, cost per lead is $40 but cost per customer is $2,000. Enter your own figures below to see the gap.

## Calculate your cost per customer

<div class="tool" id="cc-tool">
<label for="cc-spend">Ad spend per month ($)</label>
<input id="cc-spend" type="number" min="0" step="100" value="5000" inputmode="decimal" />
<label for="cc-fee">Agency or freelancer fee per month ($, 0 if none)</label>
<input id="cc-fee" type="number" min="0" step="100" value="5000" inputmode="decimal" />
<label for="cc-leads">Leads per month</label>
<input id="cc-leads" type="number" min="1" step="1" value="125" inputmode="decimal" />
<label for="cc-rate">Share of leads that become customers (%)</label>
<input id="cc-rate" type="number" min="0" max="100" step="0.5" value="4" inputmode="decimal" />
<div class="out" id="cc-out" aria-live="polite"></div>
<small>Estimates only. Excludes your own sales time and software.</small>
</div>
<script>
(function(){
function g(id){var v=parseFloat(document.getElementById(id).value);return isFinite(v)?v:0}
function m(n){return '$'+Math.round(n).toLocaleString('en-US')}
function run(){
var S=g('cc-spend'),F=g('cc-fee'),L=g('cc-leads'),R=g('cc-rate')/100;
var out=document.getElementById('cc-out');
if(L<=0){out.innerHTML='<p>Enter at least one lead.</p>';return}
var cust=L*R,html='';
html+='<p>Cost per lead (ad spend only): <strong>'+m(S/L)+'</strong></p>';
if(cust<=0){out.innerHTML=html+'<p>At a 0% lead-to-customer rate there is no cost per customer to show.</p>';return}
html+='<p>Customers per month: <strong>'+(Math.round(cust*10)/10)+'</strong></p>';
html+='<p>Cost per customer (spend plus fee): <span class="big">'+m((S+F)/cust)+'</span></p>';
var better=Math.min(1,R*1.5);
html+='<p>If your lead-to-customer rate were 1.5 times higher ('+(Math.round(better*1000)/10)+'%), cost per customer would be <strong>'+m((S+F)/(L*better))+'</strong> on the same spend.</p>';
out.innerHTML=html;
}
['cc-spend','cc-fee','cc-leads','cc-rate'].forEach(function(id){document.getElementById(id).addEventListener('input',run)});
run();
})();
</script>

## Worked example

A service business spends $5,000 a month on ads, pays a $5,000 fee, gets 125 leads and converts 4% of them.

- **Cost per lead:** $5,000 ÷ 125 = $40.
- **Customers:** 125 × 4% = 5 a month.
- **Cost per customer (spend plus fee):** $10,000 ÷ 5 = $2,000.
- **With a lead-to-customer rate 1.5 times higher (6%):** 7.5 customers, so $10,000 ÷ 7.5 = about $1,333.

The $40 lead looks cheap; the $2,000 customer is the number to compare with what a customer is worth. Improving the rate, through faster follow-up and better qualification, cut cost per customer by a third with no change in spend.

## Methodology

- **Cost per lead** = ad spend ÷ leads.
- **Customers** = leads × lead-to-customer rate.
- **Cost per customer** = (ad spend + fee) ÷ customers.
- **Improved scenario** = the same formula with the rate multiplied by 1.5, capped at 100%.

The 1.5 multiplier is an illustration of sensitivity, not a forecast of what any change will deliver. All other values come from you; the pre-filled numbers are the worked example. The calculator excludes sales time, software, refunds and tax. To get your true lead-to-customer rate, match each lead to your CRM outcomes ([how to measure real ROI](/guides/measure-real-roi-of-facebook-ads)). The metric itself is explained in [cost per lead vs cost per customer](/blog/cpl-vs-cac).

## What next?

If cost per customer is higher than a customer is worth, work on the rate before the spend: [why leads go cold](/guides/why-facebook-ad-leads-go-cold) and [the follow-up diagnostic](/guides/lead-problem-or-sales-follow-up-problem). To run it on your own account, [Book A Free Call](https://calendly.com/sean_munn/seanspersonallink).
