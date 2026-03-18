# NBF Nexus

<p align="center">
  <img src="nbf-nexus/public/logo.png" alt="NBF Nexus Logo" width="200" />
</p>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FK0lux%2Fnbf-nexus&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,OPENAI_API_KEY,DATABASE_URL)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**The Open-Source Flex-Office & AI Mentorship OS for Startups and Incubators.**
Built with Next.js 15, Supabase (pgvector) & Vercel AI SDK.

---

### 📖 The Origin Story (Why this exists)
I originally joined **New Brain Factory (NBF)** in Togo 🇹🇬 for my final-year Cybersecurity internship. My actual thesis? Building a Defensive Cyber Range using KYPO, Security Onion, and Caldera.

But as a software engineer, I noticed our hub accepted 30+ interns (Remote, Hybrid, On-site), while we only had **12 physical desks**. The administration was overwhelmed, and every new intern waited up to 24 hours just to get onboarded. Mentors were a bottleneck, repeating the same briefings over and over.

Instead of ignoring it, I paused my Cyber Range project and built **NBF Nexus**. 
Today, it runs the hub. The AI Agent handles onboarding 24/7, and the system enforces the physical desk limits perfectly. We are open-sourcing it so no other startup incubator has to suffer through manual management again.

---

### 🚀 Key Features
- **Smart Resource Allocation**: Strictly manages physical desk limits (ex: 12 chairs for 30+ people).
- **AI Mentorship (RAG)**: An AI agent connected to your Google Drive/Docs to answer intern questions 24/7.
- **Dynamic QR Attendance**: Fraud-proof attendance tracking via dynamic QR codes and Geolocation.
- **Unified Workflows**: Centralized request management for absences, permissions, and schedule changes.
- **Zero-Cost Operation**: Runs 100% on Free Tiers (Vercel, Supabase, Clerk).

---

### 🏗️ Architecture: Feature-Sliced Design (FSD)
NBF Nexus follows the **FSD** architectural pattern for maximum maintainability and scale:
- [📖 Architecture Guide](nbf-nexus/docs/ARCHITECTURE.md)
- [🧪 Testing Strategy](nbf-nexus/docs/TESTING.md)
- [🛠️ Contributing Guide](nbf-nexus/docs/CONTRIBUTING.md)
- [🧑‍🎓 User Guide](nbf-nexus/docs/USER_GUIDE.md)

---

### 🛠️ Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/K0lux/nbf-nexus.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Rename `.env.example` to `.env.local` and fill in your keys for Clerk, Supabase, and OpenAI.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

### 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Built with ❤️ by [K0lux](https://github.com/K0lux) at New Brain Factory.**
