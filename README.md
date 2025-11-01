# 🗺️ AltiDawg — AI-Powered Local Tourism Platform

AltiDawg connects travelers with authentic **local experiences** in Nepal —  
treks, homestays, food tours — all managed by local operators through a single API.

Built for **100xNepal Hackathon 2025**, powered by **NestJS + Prisma + Gemini AI**.

---

## 🚀 Overview

AltiDawg Trip lets:
- **Operators** list their experiences, manage bookings, and see analytics  
- **Travelers** discover nearby adventures and instantly book slots  
- **AI (Gemini 1.5 Flash)** generate smart tags, summaries, and personalized itineraries  

**Tech Stack**
- 🧩 **Backend:** NestJS + TypeScript  
- 💾 **Database:** PostgreSQL / SQLite via Prisma ORM  
- 🧠 **AI Engine:** Google Gemini 1.5 Flash (Free)  
- ☁️ **API Test:** Postman / Thunder Client  
- 🔐 **Auth:** x-operator-key header (no login)  

---

## ⚙️ Setup & Run

```bash
git clone https://github.com/<your-username>/neptrip.git
cd neptrip
npm install
npx prisma migrate dev --name init
npm run start:dev


🧠 AI Features (Gemini)

1️⃣ AI-Tagging & Summary
When an operator creates a new experience, Gemini analyzes the description and adds:

{
  "tags": ["culture", "homestay", "food"],
  "summary": "Immerse yourself in authentic Tharu village life."
}


2️⃣ AI Trip Planner
Endpoint: POST /v1/ai/plan-trip

{
  "city": "Pokhara",
  "days": 3,
  "interests": ["trekking", "food", "culture"]
}


Gemini responds:

{
  "title": "3-Day Cultural & Food Trek in Pokhara",
  "itinerary": [
    "Day 1: Explore lakeside cafes and local markets.",
    "Day 2: Trek to World Peace Pagoda.",
    "Day 3: Paragliding and farewell dinner."
  ]
}

🔥 Core API Flow
Step	Role	Endpoint	Method	Description
1	Dev	/dev/seed/operator	POST	Create operator (generate API key)
2	Operator	/v1/operator/experiences	POST	Create experience (AI-tags + summary)
3	Operator	/v1/operator/experiences/:id/slots/bulk	POST	Add time slots
4	Public	/v1/public/experiences	GET	Browse experiences
5	Public	/v1/public/bookings	POST	Create booking
6	Operator	/v1/operator/bookings/:id/confirm	POST	Confirm booking
7	AI	/v1/ai/plan-trip	POST	Generate trip plan (Gemini AI)
🧪 Testing with Postman

Import NepTrip_Final_API_Collection.json

Set environment variables:

baseUrl = http://localhost:3000
apiKey = your_operator_key


Recommended flow:
1️⃣ Create Operator → get apiKey
2️⃣ Create Experience → auto-AI tags
3️⃣ Create Slots
4️⃣ Create Booking
5️⃣ Confirm Booking
6️⃣ Run /v1/ai/plan-trip

🏔️ Demo Pitch

“NepTrip empowers local communities by bringing Nepal’s hidden experiences online.
Powered by AI, every experience is automatically tagged, summarized, and recommended in a personalized itinerary.”

Built by:
Team Altidawg 🧠 — Paraj + friends
For: 100xNepal Hackathon 2025

🌐 Deployment (optional)

You can deploy easily:

Backend: Render / Railway

DB: Supabase / Neon.tech

Frontend (AI-Generated): Lovable AI or Vercel v0.dev
