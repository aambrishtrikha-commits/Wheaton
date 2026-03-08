# Wheaton Hall × AppD AI — Session Summary
## Date: 07–08 March 2026
## Client: Dr. Suganderan Nayager, Wheaton Hall Medical Practice, Drogheda

---

## 1. What Was Done This Session

### A. Comprehensive Digital Audit
- Deep research of wheatonhall.ie — website structure, services, pricing, patient portal (MyClinic365), UX gaps
- Social media audit — Facebook (~630 likes, dormant), zero Instagram/LinkedIn/TikTok/YouTube
- Review ecosystem — ~2 total reviews across all platforms. Doctify unclaimed with outdated doctors. Duplicate Yelp listings. One negative Yelp review (pregnant patient booking failure) unaddressed
- Competitor analysis — DRMC (194m away, 991 Instagram, 1385 Facebook), Centric Health (mobile app, telehealth, 5800+ LinkedIn), GoodPeople Medical Centre (opened 2024, already outpacing online)
- Key finding: No GP practice in Drogheda has WhatsApp automation, AI chatbots, or AI voice agents — first-mover opportunity

### B. Pain Points Identified (5)
1. **After-hours call black hole** — phone lines close 4:45pm, no digital capture (HIGH)
2. **Invisible reputation** — ~2 reviews, unclaimed profiles, negative review unaddressed (HIGH)
3. **No-shows and booking friction** — no reminders, specialist services phone-only (HIGH)
4. **Website dead end** — no chatbot, no form, no WhatsApp, no FAQ (HIGH)
5. **Social media absence** — dormant Facebook, zero Instagram (MEDIUM)

### C. Complete Pitch Deck Built (16 slides → 17 slides)
- **PPTX file** — WheatonHall_AppD_Pitch_Deck.pptx (teal/navy design, icons, data tables, speaker notes on every slide)
- **Gamma v1** — Generated with AppD AI custom theme (16 slides)
- **Gamma v2** — Upgraded with Wheaton Hall Ireland custom theme (17 slides, added compliance slide)
- Slides cover: receptionist bottleneck opener, digital audit stats, 5 pain points, 5 solutions (AI Voice Agent, Review Automation, WhatsApp, Chatbot, Marketing), competitor teardown table, ROI model (€157,800/yr), integration approach, 30-60-90 roadmap, discovery questions, urgency builders, CTA

### D. ROI Model
| Revenue Lever | Monthly | Annual |
|---|---|---|
| Missed calls recovered | €4,950 | €59,400 |
| No-show reduction | €2,700 | €32,400 |
| New patients via reviews | €2,500 | €30,000 |
| Specialist bookings | €1,800 | €21,600 |
| Reception time saved | €1,200 | €14,400 |
| **TOTAL** | **€13,150** | **€157,800** |

### E. Irish/EU Legal Compliance Audit
Verified all 6 proposed solutions against:
- GDPR (including Art. 9 special category health data)
- Irish Data Protection Act 2018
- ePrivacy Regulations SI 336/2011 (SMS/WhatsApp/call consent rules)
- EU AI Act (transparency obligations, Ireland's 15 designated authorities)

**Verdict:** All solutions are legal. Key requirements:
- Data Processing Agreement (DPA) between AppD and Wheaton Hall
- AI transparency disclosure on all automated channels
- Soft opt-in for review prompts to existing patients + unsubscribe in every message
- Explicit opt-in for recall campaigns to mobile phones
- No clinical data stored in AppD systems
- Privacy notice update on wheatonhall.ie

### F. ElevenLabs Agent System Prompt — "Sophie" (4 iterations)
- **v1** — Capture-only mode (takes details, queues for callback)
- **v2** — Added tool awareness (check_calendar_availability + manage_calendar)
- **v3** — Explicit tool parameter mapping but still descriptive
- **v4 (FINAL)** — Full booking capability with explicit variable binding to tool JSON schemas

**Sophie v4 capabilities:**
- Real-time availability checking via `check_calendar_availability` (params: `date_query`, `user_timezone`)
- Direct appointment booking via `manage_calendar` (params: `action_type`, `client_name`, `client_email`, `client_phone`, `booking_time`, `event_id`)
- Reschedule and cancel existing appointments
- After-hours + overflow call handling
- WhatsApp and web chat mode
- FAQ answering with full practice knowledge (hours, pricing, services, doctors)
- Non-clinical urgent triage (routes to 999/NorthEastDOC)
- Demo mode for client presentations
- Graceful failsafe when tools fail — always captures details manually

### G. Integration Architecture Confirmed
- MyClinic365 has no public API — AppD works alongside, not replacing
- Make.com webhooks handle booking flow (already running for other AppD clients)
- ElevenLabs tool library has both webhook tools configured
- All data flows to AppD CRM in background — patient never sees it

---

## 2. Files Delivered This Session

| File | Type | Purpose |
|---|---|---|
| WheatonHall_AppD_Pitch_Deck.pptx | PPTX | Downloadable 16-slide pitch deck |
| Gamma_Prompt_WheatonHall.md | Markdown | Gamma-ready paste prompt (backup) |
| Gamma Presentation v1 | Gamma link | AppD AI theme |
| Gamma Presentation v2 | Gamma link | Wheaton Hall Ireland theme, 17 slides |
| ElevenLabs_System_Prompt_WheatonHall_Sophie.md | Markdown | v1 system prompt (capture only) |
| ElevenLabs_System_Prompt_WheatonHall_Sophie_v2_Full_Booking.md | Markdown | v2 with tool awareness |
| Sophie_v3_WheatonHall_System_Prompt.md | Markdown | v3 with explicit collection flow |
| Sophie_v4_WheatonHall_Final_System_Prompt.md | Markdown | v4 FINAL with full variable binding |
| Wheaton_Hall_Medical_Practice__Digital_Audit_and_AI_Automation_Opportunities.md | Markdown | Full digital audit report (project file) |

---

## 3. Key Decisions Made

1. **Lead with receptionist problem** — Dr. Suganderan's own concern. Yelp pregnant patient complaint is the hook.
2. **First-mover positioning** — No Drogheda GP has AI tools. Wheaton Hall can own the narrative.
3. **MyClinic365 limitation accepted** — No API. AppD works alongside via parallel calendar + Make.com webhooks.
4. **Compliance-first approach** — Legal audit completed before pitch, included as slide in deck. Builds trust.
5. **Sophie as agent name** — Warm, Irish-appropriate, no AI associations. Discloses AI status when asked but never leads with it.
6. **Tool parameters explicitly bound** — v4 prompt maps every JSON field to a conversational question so the LLM knows exactly what to collect and pass.
7. **CRM capture is invisible** — During demo, data flows to AppD CRM. Dr. Suganderan sees it populate in real time. Patient never knows.

---

## 4. Open Items / Not Yet Done

| Item | Status | Priority |
|---|---|---|
| AppD pricing / packaging for Wheaton Hall | Not discussed — need Aambrish's cost model | HIGH — needed before proposal |
| Data Processing Agreement (DPA) template | Identified as requirement, not drafted | HIGH — legal prerequisite |
| Privacy notice update for wheatonhall.ie | Identified as Phase 1 task | MEDIUM |
| Make.com scenario blueprint for Wheaton Hall | Tools exist but scenario not customised for this client | MEDIUM |
| WhatsApp Business API setup (GreenAPI/Twilio) | Architecture known, not configured | MEDIUM |
| Website chatbot deployment on wheatonhall.ie | Solution defined, not built | MEDIUM |
| Instagram account creation + content calendar | Phase 3, not started | LOW |
| Email newsletter setup | Phase 3, not started | LOW |
| Live demo agent deployment (Sophie on Hostinger) | System prompt ready, agent not configured | HIGH — needed for demo |

---

## 5. Continuation Prompt for Next Session

Paste this at the start of the next conversation to restore full context:

---

```
CONTEXT RESTORATION — Wheaton Hall × AppD AI Project

I'm Aambrish from AppD AI Automations & Business Solutions. We're preparing to close a deal with Dr. Suganderan Nayager at Wheaton Hall Medical Practice (Dublin Road, Drogheda, Co. Louth, Ireland).

WHAT'S DONE:
- Full digital audit of Wheaton Hall completed (website, social media, reviews, competitors). Audit is in the project file.
- 17-slide pitch deck built (PPTX + Gamma with "Wheaton Hall Ireland" theme). Covers: receptionist bottleneck opener, 5 pain points, 5 AI solutions (Voice Agent, Review Automation, WhatsApp, Chatbot, Marketing), competitor teardown, ROI model (€157,800/yr impact), integration approach (MyClinic365 has no API — we work alongside), 30-60-90 roadmap, discovery questions, compliance slide, CTA.
- Full Irish/EU legal compliance audit done — GDPR, DPA 2018, ePrivacy Regulations, EU AI Act. All solutions verified legal with specific consent requirements documented.
- ElevenLabs AI agent system prompt "Sophie v4" completed with full booking capability. Uses two Make.com webhook tools already in our ElevenLabs tool library:
  - check_calendar_availability (params: date_query, user_timezone)
  - manage_calendar (params: action_type, client_name, client_email, client_phone, booking_time, event_id)
  Sophie collects all required fields conversationally, books/reschedules/cancels directly, handles after-hours + overflow, works on voice + WhatsApp + web chat. All data flows to AppD CRM in background.

KEY FACTS ABOUT THE CLIENT:
- Practice: 6 GPs, 4 nurses, 9 reception staff, ~1999 established
- Owners: Dr. Suganderan (Sugan) Nayager + Dr. Helen Kilrane (second generation — founders retired)
- Competitor threat: DRMC is 194 metres away with 3x social media presence
- Current state: ~2 online reviews total, dormant Facebook, zero Instagram, no chatbot/WhatsApp/AI tools, phone-only specialist booking
- MyClinic365 portal used but no public API available
- Practice email marked "not secure for patient contact" — they care about GDPR
- Introduction was through a mutual connection (warm referral)

WHAT I NEED NEXT:
[State what you need — e.g., pricing model, DPA template, Make.com scenario, live demo setup, discovery call script, follow-up email, etc.]
```

---