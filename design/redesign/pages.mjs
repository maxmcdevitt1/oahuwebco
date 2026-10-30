// Redesign page builder: every site page as static HTML in the newfront-style system (theme.css),
// with the site's existing copy. Used by tools/figma-export.mjs (--design) for the browser preview
// and for Figma; not part of the Astro build. `assetBase` prefixes /public assets for the preview.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const islandPath = /d="([^"]+)"/.exec(readFileSync(join(root, "src/components/Island.astro"), "utf8"))[1];

const site = {
  name: "Oahu Web Co.", tagline: "The online side, handled.", email: "max@oahuwebco.com",
  phone: "(808) 829-9840", tel: "tel:+18088299840", town: "Kāneʻohe", island: "Oʻahu",
  instagram: "https://www.instagram.com/oahuwebco/", facebook: "https://www.facebook.com/profile.php?id=61594976416835",
};
const services = {
  "reach-more-customers": "Reach more customers",
  "convert-more-inquiries": "Convert more inquiries",
  "build-repeat-business": "Build repeat business",
  "measure-and-improve": "Measure and improve",
  "local-seo": "Local SEO",
  "websites": "Websites",
};
const outcomes = Object.keys(services).slice(0, 4);

/* ---------- Shared pieces ---------- */
const island = () =>
  `<svg class="island" viewBox="-160 -120 320 250" width="760" height="594" aria-hidden="true"><path d="${islandPath}" fill="#2A4F86"/></svg>`;

const header = (A) => `
<div class="header"><div class="container"><div class="bar">
  <a class="logo" href="/"><img src="${A}/logo-128.png" width="40" height="40" alt="">${site.name}</a>
  <nav class="nav"><a href="/#what">What we do</a><a href="/#pricing">Pricing</a><a href="/about/">About</a><a href="/review/">Leave a review</a></nav>
  <div class="right"><a class="lnk" href="${site.tel}">${site.phone}</a><a class="btn btn-cream btn-sm" href="/#contact">Get a free review</a><a class="call" href="${site.tel}">Call</a><span class="burger"><i></i><i></i><i></i></span></div>
</div></div></div>`;

const hero = ({ cls = "inner", eyebrow, title, size = "display-l", hook, actions = [] }) => `
<section class="hero ${cls}">
  <div class="glow"></div>${island()}
  <div class="container"><div class="copy">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
    <h1 class="${size}">${title}</h1>
    ${hook ? `<p class="hook">${hook}</p>` : ""}
    ${actions.length ? `<div class="actions">${actions.map(([t, h, v = "btn-cream"]) => `<a class="btn ${v}" href="${h}">${t}</a>`).join("")}</div>` : ""}
  </div></div>
</section>`;

const cta = (title, [t, h], p = "") => `
<section class="cta"><div class="container"><div class="copy">
  <h2 class="display-l">${title}</h2>${p ? `<p class="lead" style="color:rgba(255,255,255,.76)">${p}</p>` : ""}
  <a class="btn btn-cream btn-l" href="${h}">${t}</a>
</div></div></section>`;

const footer = (A) => `
<footer class="footer"><div class="container">
  <div class="fgrid">
    <div class="fbrand"><a class="logo" href="/"><img src="${A}/logo-128.png" width="40" height="40" alt="">${site.name}</a><p class="tag">${site.tagline}</p></div>
    <div class="fcol"><p class="ft">What we do</p>${Object.entries(services).map(([s, n]) => `<a href="/${s}/">${n}</a>`).join("")}</div>
    <div class="fcol"><p class="ft">Company</p><a href="/about/">Who’s behind it</a><a href="/review/">Leave a review</a><a href="/privacy/">Privacy policy</a></div>
    <div class="fcol"><p class="ft">Contact</p><a href="${site.tel}">${site.phone}</a><a href="mailto:${site.email}">${site.email}</a><a href="${site.instagram}">Instagram @oahuwebco</a><a href="${site.facebook}">Facebook</a></div>
  </div>
  <div class="fbot"><span>© 2026 ${site.name}</span><span>${site.town}, ${site.island}</span></div>
</div></footer>`;

const section = (title, body, extra = "") => `
<div class="section ${extra}"><div class="head"><h2 class="h2">${title}</h2></div><div class="stack">${body}</div></div>`;
const numList = (items) => `<ul class="num-list">${items.map(([t, p], i) => `<li><span class="n">0${i + 1}</span><h3 class="h3">${t}</h3><p>${p}</p></li>`).join("")}</ul>`;
const dotList = (items) => `<ul class="dot-list">${items.map(([t, p]) => `<li><span class="dot"></span><div><h3 class="h3">${t}</h3><p>${p}</p></div></li>`).join("")}</ul>`;
const faq = (items) => `<ul class="faq">${items.map(([q, a]) => `<li><div><p class="q">${q}</p><p class="a">${a}</p></div><span class="plus">+</span></li>`).join("")}</ul>`;
const rows = (slugs) => `<ul class="rows">${slugs.map((s) => `<li><a href="/${s}/">${services[s]}<span class="arrow">→</span></a></li>`).join("")}</ul>`;
const visual = (label, inner) => `<div class="visual"><p class="vt">${label}</p>${inner}</div>`;

const shell = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><link rel="stylesheet" href="/design/redesign/theme.css"></head>
<body>${body}</body></html>`;

/** Service page: hero, feature visual + numbered problems, optional "What changes", FAQ, more, CTA. */
const servicePage = (A, p) => shell(`${p.title} · ${site.name}`, `
${header(A)}
${hero({ eyebrow: "What we do", title: p.h1, hook: p.hook, actions: [[p.btn, p.btnHref ?? "/#contact"]] })}
<main class="sheet"><div class="container">
  <div class="feature">${p.visual}<div class="stack"><div class="head"><h2 class="h2">${p.problemsTitle}</h2></div>${numList(p.problems)}</div></div>
  ${p.changes ? section("What changes", dotList(p.changes)) : ""}
  ${section("Questions", faq(p.faq))}
  ${section("More of what we do", rows(p.more))}
</div></main>
${cta(p.ctaTitle, [p.ctaBtn ?? p.btn, p.btnHref ?? "/#contact"])}
${footer(A)}`);

/* ---------- Pages ---------- */
export const pages = [
  { slug: "home", title: "Home", html: (A) => shell(`${site.name} · ${site.tagline}`, `
${header(A)}
${hero({ cls: "home", eyebrow: `${site.town}, ${site.island}`, size: "display-xl", title: "We take the online side off your hands.", actions: [["Try it free for 30 days", "/#contact"], ["See what we do", "/#what", "btn-ghost"]] })}
<main class="sheet" id="what"><div class="container">
  <div class="section half"><div class="head"><p class="eyebrow">What we do</p><h2 class="h2">We help local businesses improve their online performance: more of the right customers finding you, more calls, more jobs.</h2></div>
    <ul class="cards">
      <li class="card"><h3 class="h3">Reach more customers</h3><p>Local search, Google Business Profiles, websites and ads that put you in front of the people looking for your work.</p><span class="go">→</span></li>
      <li class="card"><h3 class="h3">Convert more inquiries</h3><p>Call handling, fast replies and estimate follow-up that turn interest into booked jobs.</p><span class="go">→</span></li>
      <li class="card"><h3 class="h3">Build repeat business</h3><p>Reviews, service reminders and referrals that bring customers back and send new ones your way.</p><span class="go">→</span></li>
      <li class="card"><h3 class="h3">Measure and improve</h3><p>Analytics, tracking and automation that show what’s working and where to invest next.</p><span class="go">→</span></li>
    </ul></div>
  <div class="section stackd"><div class="head"><p class="eyebrow">At a $400 average job</p><h2 class="h2">What a missed customer costs.</h2></div>
    <ul class="stats">
      <li class="stat"><span class="mark"></span><span class="num">$9,600</span><span class="cap">a year, when two callers a month pick someone else</span></li>
      <li class="stat"><span class="mark"></span><span class="num">$1,700</span><span class="cap">a month, from one missed call a week</span></li>
      <li class="stat"><span class="mark"></span><span class="num">$4,000</span><span class="cap">a year, when ten past customers skip a yearly service</span></li>
    </ul></div>
  <div class="section stackd" id="pricing"><div class="head"><p class="eyebrow">Pricing</p><h2 class="h2">Your exact price is quoted after a free review.</h2></div>
    <div class="prices">
      <div class="price"><p class="name">30-day missed-call trial</p><p>We catch the calls you can’t pick up and show you how many turned into jobs. Free for 30 days, then month to month from $300 a month, estimated. If your average job is $400, one caught call a month covers it. It stops on its own if you don’t continue.</p><p class="amt">$0</p></div>
      <div class="price"><p class="name">Free review</p><p>Where your business stands online, and where the room to grow is.</p><p class="amt">$0</p></div>
      <div class="price"><p class="name">Foundation</p><p>One-time. Close the gaps holding you back and set up what growth is built on. Done in ten business days, and you pay when it’s done. Estimated range; your exact price is quoted after the review.</p><p class="amt">$750–$1,500<small>est.</small></p></div>
      <div class="price"><p class="name">Ongoing growth</p><p>Steady monthly work on what grows your business. Month to month; you keep everything if you stop. Estimated range; your exact price is quoted after the review.</p><p class="amt">$300–$750<small>/mo est.</small></p></div>
      <div class="price"><p class="name">Websites</p><p>Built to bring in work. Estimated price; your exact price is quoted after the review.</p><p class="amt">$500<small>est.</small></p></div>
    </div></div>
</div></main>
<section class="sheet dark" id="contact"><div class="container"><div class="contact">
  <div class="copy"><p class="eyebrow">Start free</p><p class="big">Aloha. Tell us about your business and we’ll get back to you.</p><p class="muted">Or call, text or email directly:</p><p class="big">${site.phone}</p><p class="big" style="margin-top:-12px">${site.email}</p></div>
  <div class="form">
    <div class="chips"><span class="chip on">Stop missing calls</span><span class="chip">Get found by more customers</span><span class="chip">A website that brings in work</span><span class="chip">More reviews, more repeat work</span><span class="chip">Not sure yet, let’s talk</span></div>
    <div class="fields"><label class="field">Your name<span class="in"></span></label><label class="field">Business name<span class="in"></span></label></div>
    <div class="fields"><label class="field">Email or phone<span class="in"></span></label><label class="field">The phone number customers call<span class="in"></span></label></div>
    <label class="field">Anything else we should know?<span class="in ta"></span></label>
    <a class="btn btn-navy" href="/thanks/">Get started free</a>
  </div>
</div></div></section>
${footer(A)}`) },

  { slug: "about", title: "About", html: (A) => shell(`About · ${site.name}`, `
${header(A)}
${hero({ eyebrow: "About", title: "Who’s behind the scenes?" })}
<main class="sheet"><div class="container">
  <div class="about"><div class="portrait"><img src="${A}/about/max-photo.jpg" width="420" height="525" alt="Max, founder of Oahu Web Co."></div>
    <div class="prose">
      <p>My name is Max, and I am the creator of Oahu Web Co. I am a veteran of the United States Army, and I created this company because I’ve seen the small businesses on the island, and I’ve seen the same problem again and again: companies have a great business and do great work, but the money comes in slow.</p>
      <p>The truth is, to be able to succeed as a small business in today’s world, you need to be <em class="serif-i">convenient</em>. People don’t want to go through two Google pages and have to rely on a business that has no information and two reviews. And you don’t want to be the company stuck on the third page while all the companies on the first are getting jobs.</p>
      <p>That’s why I created Oahu Web Co.: to serve the small businesses of Oʻahu and assist them with their online presence, from searchability, to professional web pages, or to something else. I am here to assist you and your business in today’s digital world, and together we will convert your company into a top performer!</p>
    </div></div>
  ${section("What we do", rows(outcomes))}
</div></main>
${cta("Get a free review", ["Request my free review", "/#contact"], "Tell us about your business and we’ll show you where the room to grow is.")}
${footer(A)}`) },

  { slug: "reach-more-customers", title: "Reach more customers", html: (A) => servicePage(A, {
    title: "Reach more customers", h1: "Reach more customers", hook: "If customers can’t find you, they’ll call someone else.", btn: "Request my free review",
    visual: visual("Nearby search", `<div class="search"><span class="mag"></span>plumber near me</div><ul class="res"><li class="you"><span class="rn">Your business</span><span class="rm">Open now · ${site.town}</span></li><li><span class="ph"></span><span class="ph s"></span></li><li><span class="ph"></span><span class="ph s"></span></li></ul>`),
    problemsTitle: "The work",
    problems: [
      ["Google Business Profile", "A weak first impression can send customers to a competitor. At $400 a job, two callers a month who pick someone else is $9,600 a year. We help make your business the one they want to call."],
      ["Local search", "Customers can’t hire you if they can’t find you. We help your business get noticed when people need your work."],
      ["Websites", "A confusing website can lose customers before they call. We make it easier for them to choose your business."],
      ["Online ads", "Reach customers who are ready to hire, without spending on an audience you don’t want."],
    ],
    faq: [
      ["How long does it take to show up higher on Google?", "Results take time and vary. We help make your business easier to find without promising rankings."],
      ["Do I need a new website?", "Not necessarily. If your current site is costing you customers, we can improve what you already have."],
      ["Who owns the accounts?", "You do. Your accounts and finished work stay yours."],
    ],
    more: ["convert-more-inquiries", "build-repeat-business", "measure-and-improve"],
    ctaTitle: "Get a free review",
  }) },

  { slug: "convert-more-inquiries", title: "Convert more inquiries", html: (A) => servicePage(A, {
    title: "Convert more inquiries", h1: "Turn more inquiries into booked jobs", hook: "Every missed call is a job for someone else.", btn: "Try it free for 30 days",
    visual: visual("This morning", `<ul class="tl"><li><span class="d miss"></span><span class="s">Missed call</span><span class="t">7:42 AM</span></li><li><span class="d"></span><span class="s">Replied to customer</span><span class="t">7:43 AM</span></li><li><span class="d"></span><span class="s">Job booked</span><span class="t">7:51 AM</span></li></ul>`),
    problemsTitle: "Where jobs slip away",
    problems: [
      ["Missed calls", "Many people who reach voicemail don’t leave a message. They just call the next business on the list. If your average job is $400, one missed call a week is about $1,700 a month."],
      ["Slow replies", "A website form or message that waits until evening can lose to a competitor who answered in minutes."],
      ["Forgotten estimates", "Plenty of quotes aren’t turned down. They’re forgotten, and the job goes to whoever checked in. Two forgotten $1,500 estimates a month is $3,000 of work."],
      ["Hard-to-use forms", "If asking for a quote feels slow or confusing, customers give up before you ever hear from them."],
    ],
    changes: [
      ["Every customer hears back", "Callers and messages get a timely answer, even when you’re on a job, so fewer go elsewhere."],
      ["More quotes turn into a yes", "Open estimates get a friendly follow-up at the right time instead of going quiet."],
      ["Less chasing for you", "You spend your day on the work, not keeping track of who still needs a callback."],
      ["You can see the difference", "You’ll know how many inquiries came in, how fast they were answered and how many became jobs."],
    ],
    faq: [
      ["I’m on a job all day. How can I answer every call?", "You don’t have to. We make sure customers aren’t left waiting, even when you can’t pick up."],
      ["Can I try it first?", "Yes. For 30 days we catch the calls you can’t pick up, free, and show you how many became jobs. It stops on its own if you don’t continue."],
      ["Do I need new software?", "Usually not. We start with what you already use, and nothing that adds cost happens without your approval."],
      ["Can you guarantee more jobs?", "No one can honestly promise that. Our goal is that fewer of the inquiries you already get slip away, and we show you the numbers."],
    ],
    more: ["reach-more-customers", "build-repeat-business", "measure-and-improve"],
    ctaTitle: "See how many calls you’re missing",
  }) },

  { slug: "build-repeat-business", title: "Build repeat business", html: (A) => servicePage(A, {
    title: "Build repeat business", h1: "Bring customers back and earn more referrals", hook: "Your next job could come from a customer you already have.", btn: "Request my free review",
    visual: visual("The loop", `<div class="steps"><div class="st"><span class="ic"></span>Job done</div><span class="ar">→</span><div class="st hot"><span class="ic"></span>Review</div><span class="ar">→</span><div class="st"><span class="ic"></span>Back again</div></div>`),
    problemsTitle: "What quiet customers cost you",
    problems: [
      ["Too few recent reviews", "New customers can’t see your good work. A competitor with more recent reviews can look like the safer call."],
      ["Forgotten return visits", "When the next service comes due, customers who can’t remember your name start searching again."],
      ["Referrals left to chance", "Happy customers mean to recommend you, but your name doesn’t always come up when a friend asks."],
      ["Past customers going cold", "Every past customer is a relationship you already paid to earn. Letting it fade means always starting over. Ten past customers who skip a yearly $400 service is $4,000 a year."],
    ],
    changes: [
      ["A reputation that shows your work", "More of your happy customers leave reviews, so new ones see a business they can trust."],
      ["Customers who come back", "Past customers hear from you when it’s time for the next job, before they think to search."],
      ["More word of mouth", "Satisfied customers find it easy to send friends and family your way."],
      ["Steadier work", "More of your jobs come from people who already know you, so you depend less on finding new customers."],
    ],
    faq: [
      ["We already get referrals. Why do we need this?", "That’s a good sign. Plenty of happy customers still never think to recommend you, and we help more of them do it."],
      ["Isn’t asking for reviews pushy?", "Not when it’s done well. Customers hear from you at the right time, in a way that feels like good service."],
      ["Will you write reviews for us?", "No. Every review comes from a real customer, in their own words."],
      ["My customer list is a mess.", "That’s common. You don’t need a perfect list to start, and we work with what you have."],
    ],
    more: ["reach-more-customers", "convert-more-inquiries", "measure-and-improve"],
    ctaTitle: "Keep your customers coming back",
  }) },

  { slug: "measure-and-improve", title: "Measure and improve", html: (A) => servicePage(A, {
    title: "Measure and improve", h1: "Measure and improve", hook: "Stop guessing which marketing brings in your jobs.", btn: "Request my free review",
    visual: visual("Monthly report · September", `<div class="rep"><div class="rh"><b>Example Roofing Co.</b><span>One page</span></div>
      <div class="kpis"><div class="kpi"><p class="v">34</p><p class="l">Inquiries · up 4 from August</p></div><div class="kpi"><p class="v">17</p><p class="l">Booked jobs · up 3 from August</p></div><div class="kpi"><p class="v">12 min</p><p class="l">Typical reply time · was about 3 hours</p></div></div>
      <div class="chart">${[["Apr", 19], ["May", 22], ["Jun", 21], ["Jul", 27], ["Aug", 30], ["Sep", 34]].map(([m, v]) => `<div class="b"><span class="bar" style="height:${Math.round((v / 34) * 84)}px"></span><span class="m">${m}</span></div>`).join("")}</div>
      <ul class="src"><li><b>Booked jobs by source</b><span></span></li><li><span>Google listing</span><b>7</b></li><li><span>Referrals</span><b>4</b></li><li><span>Website</span><b>3</b></li><li><span>Repeat customers</span><b>2</b></li><li><span>Google ads</span><b>1</b></li></ul></div>`),
    problemsTitle: "The work",
    problems: [
      ["Know where jobs come from", "You’ll know which listing, ad or referral brought in each call, form and message."],
      ["Monthly report", "One page each month in plain words: how many inquiries and jobs came in, where they came from, and what comes next."],
      ["Nothing forgotten", "The tasks that keep slipping through the cracks happen on time, without anyone having to remember."],
      ["Your accounts, your data", "Your numbers live in your own accounts, so they stay yours."],
    ],
    faq: [
      ["What will I actually see?", "A one-page report each month and a short call to go over it if you want one. No dashboards you have to learn."],
      ["Do you need access to my finances?", "No. Job counts and, if you’re willing to share it, your average job value are enough to show which channels pay."],
    ],
    more: ["reach-more-customers", "convert-more-inquiries", "build-repeat-business"],
    ctaTitle: "Get a free review",
  }) },

  { slug: "local-seo", title: "Local SEO", html: (A) => servicePage(A, {
    title: "Local SEO", h1: "Local SEO for Oʻahu businesses", hook: "If you’re not on the map, you’re not on the list.", btn: "Request my free review",
    visual: visual("Nearby results", `<div class="map"><span class="rd" style="left:-5%;top:38%;width:110%;transform:rotate(-8deg)"></span><span class="rd" style="left:60%;top:-10%;height:120%;width:10px;transform:rotate(14deg)"></span>
      <span class="pin" style="left:18%;top:22%"></span><span class="lbl" style="left:14%;top:38%">Competitor A</span>
      <span class="pin" style="left:68%;top:56%"></span><span class="lbl" style="left:60%;top:72%">Competitor B</span>
      <span class="pin ghost" style="left:42%;top:40%"></span><span class="lbl ghost" style="left:36%;top:56%">Your business</span></div>`),
    problemsTitle: "Where local search loses you calls",
    problems: [
      ["Missing from the map", "People searching nearby choose from the map. If you’re not there, they never know you exist."],
      ["Out-of-date listing", "Wrong hours or a missing phone number send calls to a competitor. At $400 a job, one lost call a week is about $20,000 a year."],
      ["Few or old reviews", "Customers compare reviews before they call. A thin record makes the choice for them."],
      ["A website that doesn’t back you up", "Google looks at your site too. If it doesn’t say what you do and where, you’re harder to find."],
    ],
    faq: [
      ["What is local SEO?", "Showing up when people nearby search for what you do, on Google Search and Maps."],
      ["How long does it take?", "It takes time and varies by trade and town. We don’t promise rankings."],
      ["Who owns my Google Business Profile?", "You do. Your profile and accounts stay yours."],
      ["Do you work outside Kāneʻohe?", "Yes. We work with businesses across Oʻahu, from Kailua to Kapolei."],
    ],
    more: ["websites", "reach-more-customers", "build-repeat-business"],
    ctaTitle: "Get a free review",
  }) },

  { slug: "websites", title: "Websites", html: (A) => servicePage(A, {
    title: "Websites", h1: "Websites for Oʻahu businesses", hook: "A website that doesn’t get calls is just a brochure.", btn: "Request my free review",
    visual: visual("On a phone", `<div class="phone"><div class="scr"><span class="ph s"></span><p class="pt">Your business, easy to call.</p><span class="ph"></span><span class="ph w"></span><span class="cta">Tap to call</span></div></div>`),
    problemsTitle: "Where websites lose customers",
    problems: [
      ["Hard to use on a phone", "Most customers find you on their phone. If your number is hard to tap, they call the next business."],
      ["Slow to load", "People don’t wait. A slow page sends them back to the search results."],
      ["No clear next step", "If it isn’t obvious how to call, book or get a quote, many people leave without asking. If that’s two $400 jobs a month, it’s $9,600 a year."],
      ["Invisible on Google", "A site Google can’t make sense of won’t help anyone find you."],
    ],
    faq: [
      ["What does a website cost?", "About $500, estimated. Your exact price is quoted after a free review."],
      ["Can you fix my current site instead?", "Yes. If your site can be improved instead of replaced, we’ll tell you."],
      ["Who owns the website?", "You do. Your domain and content stay yours."],
      ["Do you work outside Kāneʻohe?", "Yes. We work with businesses across Oʻahu, from Kailua to Kapolei."],
    ],
    more: ["local-seo", "reach-more-customers", "convert-more-inquiries"],
    ctaTitle: "Get a free review",
  }) },

  { slug: "review", title: "Leave a review", html: (A) => shell(`Leave a review · ${site.name}`, `
${header(A)}
${hero({ cls: "inner center", eyebrow: "Reviews", title: "Leave us a review", hook: "Worked with us? A short Google review helps other Oʻahu businesses find us. Mahalo.", actions: [["Write a Google review", "https://g.page/r/CetlKai4DszuEBM/review"]] })}
<main class="sheet"><div class="container"><div class="review">
  <div class="stack"><h2 class="h2" style="color:var(--navy-900)">On your phone, point the camera at the code.</h2><p class="lead">It opens our Google review page.</p></div>
  <div class="qr"><img src="${A}/review/google-review-qr.svg" width="220" height="220" alt="QR code for the Google review page"><p class="cap">Google review · ${site.name}</p></div>
</div></div></main>
${footer(A)}`) },

  { slug: "privacy", title: "Privacy policy", html: (A) => shell(`Privacy policy · ${site.name}`, `
${header(A)}
${hero({ eyebrow: "Legal", title: "Privacy policy", hook: "How we handle information you share through our website." })}
<main class="sheet"><div class="container"><div class="section" style="padding-top:48px"><div class="head"><p class="date">Effective October 15, 2026</p></div><div class="prose">
  <h2>Information you send us</h2>
  <p>When you request a free review through our contact form, we collect the name, business name, email address or phone number, and any message you choose to send. If you contact us directly by email, we receive the information you include in that message.</p>
  <p>Please avoid submitting sensitive personal or financial information through the contact form.</p>
  <h2>How we use your information</h2>
  <p>We use what you send to respond to inquiries, discuss requested services, and keep normal business correspondence and records. We do not sell contact information submitted through the form.</p>
  <h2>Contact form and email</h2>
  <p>Our contact form uses FormSubmit to deliver submissions to our business email. FormSubmit states that it retains form submissions for 30 days. Messages delivered to our email account may be kept longer for correspondence, business records, or legal obligations.</p>
  <h2>Website hosting, fonts and analytics</h2>
  <p>Our website is hosted using GitHub Pages. GitHub states that it logs visitors’ IP addresses for security purposes. Our typefaces are served from our own website, so loading them does not connect your browser to a third party.</p>
  <p>We use Google Analytics to understand how visitors find and use this website, such as which pages are viewed and how visitors arrived. Google Analytics sets cookies and collects information about your device, browser and activity on this site. Google processes this information as described in <a href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites that use its services</a>. You can block these cookies in your browser settings or with the <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</a>.</p>
  <p>This website does not use advertising pixels.</p>
  <h2>Other websites</h2>
  <p>We link to services such as Instagram and Facebook. If you follow those links, their privacy practices apply to your activity there.</p>
  <h2>Keeping information and your choices</h2>
  <p>We keep correspondence as long as reasonably necessary to handle an inquiry, maintain business records, or meet legal requirements. You can ask us about information you have sent, request a correction, or ask us to delete it, subject to any applicable recordkeeping obligations.</p>
  <p>For privacy questions or requests, email us at <a href="mailto:${site.email}">${site.email}</a>.</p>
  <h2>Changes to this policy</h2>
  <p>We may update this policy when our website or practices change. The effective date at the top will show when it was last updated.</p>
</div></div></div></main>
${footer(A)}`) },

  { slug: "thanks", title: "Thanks", html: (A) => notice(A, "Message sent", "Got it. Mahalo.", "Your message came through. We will get back to you as soon as possible.") },
  { slug: "404", title: "404", html: (A) => notice(A, "Page not found", "That page isn’t here.", "Sorry about that. Head back to the home page to see what we do, or send us a note and we’ll help you find what you need.") },
];

function notice(A, title, heading, text) {
  return shell(`${title} · ${site.name}`, `
<section class="notice"><div class="glow"></div>${island()}<div class="container top"><img src="${A}/logo-128.png" width="40" height="40" alt="">${site.name}</div>
<div class="container"><div class="mid"><h1 class="display-xl">${heading}</h1><p>${text}</p><div class="actions"><a class="btn btn-cream btn-l" href="/">Back to the home page</a></div></div></div>
<div class="container bot"><strong>${site.name}</strong> ${site.tagline} ${site.town}, ${site.island}.</div></section>`);
}
