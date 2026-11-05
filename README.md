# Saathi (साथी): a voice-first government scheme assistant

**Hackathon:** Hack Paradise, KAUSHALYA 2.0 (CSVTU Bhilai) · 8-hour build
**🔗 Live demo:** https://saikumar1125.github.io/saathi/ (open in Chrome or Edge)
**Prize targets:** Top 3 + **Best Project Built with ElevenLabs** + n8n sponsor angle

---

## Problem statement

> Millions of eligible rural citizens in Chhattisgarh never get the welfare benefits meant for them.
> The schemes exist, but the information is spread across dozens of English/Hindi web portals,
> written in bureaucratic language, and made for people who can read, type and use a smartphone well.

- Chhattisgarh's literacy rate (~71%) is below the national average, and lower among rural women and tribal communities.
- Many first-time smartphone users can *speak*, but struggle to *type or read*, especially in English.
- Eligible families miss out on PM-KISAN, Mahtari Vandan, Ayushman Bharat, Ujjwala, PMAY-G and scholarships,
  or they pay middlemen just to find out what they qualify for.

**How might we let any citizen find every scheme they qualify for, plus the documents and where to apply, just by talking in Hindi for one minute?**

## Solution

**Saathi** is a voice assistant that runs in the browser (no app install):

1. **Talk, don't type.** Saathi asks ~8 simple questions out loud (age, work, land, income, category, ration card, house…) in **Hindi or English**, in a natural **ElevenLabs** voice.
2. **Understands spoken answers:** "25 साल", "das hazaar", "haan", "नहीं है", "kisan hoon".
3. **Instant eligibility engine.** Rules for 10 central and Chhattisgarh schemes. Shows matched schemes, benefit, documents needed and where to apply, plus an **estimated yearly cash benefit** (the "wow" number for judges).
4. **Every card can be read aloud** with 🔊, for users who can't read.
5. **Send to phone.** One tap sends the summary to an **n8n** workflow that texts it by SMS/WhatsApp *and* logs it to a Google Sheet, which becomes an impact dashboard for panchayats and NGOs.
6. **Works without keys too.** Falls back to the browser voice, and every question has tap-able answer chips (low-literacy and accessibility friendly).

## Why it can win

| Judging angle | Saathi |
|---|---|
| Real problem / social impact | Welfare access for rural CG, measurable in ₹ unlocked per family |
| Local relevance | Chhattisgarh-specific schemes (Mahtari Vandan, Krishak Unnati), Hindi-first |
| Sponsor tech | ElevenLabs is the core UX (voice), n8n is the delivery and data backbone |
| Demo-ability | 60-second live voice demo with a big ₹ number at the end |
| Feasibility | Pure HTML/JS, no backend to break during judging |
| Scalability | Add schemes as JSON rules, add Chhattisgarhi/Gondi voices, IVR via phone call |

## Run it

1. Open `index.html` in **Chrome or Edge** (the mic needs `localhost` or https, so run `python -m http.server 8000` in this folder and open http://localhost:8000).
2. ⚙️ Settings:
   - **ElevenLabs API key** (free tier works). Optional voice ID; pick a Hindi-capable voice from the ElevenLabs Voice Library.
   - **n8n webhook URL**: import `n8n-workflow.json` into n8n Cloud (free Pro licence from the sponsor), set your SMS/WhatsApp API and Google Sheet, activate, and paste the production webhook URL.
3. Press 🎤 and answer.

## Files

- `index.html`, `styles.css`: UI
- `app.js`: conversation flow, Hindi/English speech parsing, ElevenLabs TTS, n8n call
- `schemes.js`: eligibility rules (edit/add schemes here)
- `n8n-workflow.json`: Webhook → format → SMS/WhatsApp + Google Sheet → respond

## 3-minute pitch script

1. **Hook (20s):** "Sunita didi in Durg qualifies for ₹18,000 a year in schemes. She gets none of it, because she can't read the portals. Saathi fixes that in one minute, by voice."
2. **Live demo (90s):** Switch to Hindi and answer as a 30-year-old married woman farmer with a BPL card and a kutcha house. Saathi speaks the results, and the card shows ~₹30,000/yr and 7+ schemes. Tap "Send to phone" and show the SMS plus the Google Sheet row appearing.
3. **Tech (30s):** ElevenLabs multilingual voice, browser speech recognition, rule engine, n8n automation.
4. **Impact and next steps (40s):** CSC/Anganwadi kiosks, an IVR phone line for feature phones, Chhattisgarhi voice cloning with ElevenLabs, auto-filled application forms.

## Ideas to add during the 8 hours

- ElevenLabs **Conversational AI agent** for free-form questions ("Ujjwala ke liye kya chahiye?")
- Chhattisgarhi language mode
- Nearest CSC centre on a map
- Admin dashboard chart from the Google Sheet

> Scheme amounts and rules are simplified for the prototype. Verify on official portals.
