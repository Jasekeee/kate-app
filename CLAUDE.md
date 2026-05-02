# CLAUDE.md — Project Brief for Käte
*Read this file carefully before starting any work. This is the full project context.*

---

## 👋 Hello, Claude Code

You are my co-founder and lead engineer for **Käte** — a 21-day sprint to build a mobile-native gasless Solana wallet and apply for Solana Mobile grants.

My background: **5 years in crypto, NOT a developer**. I can copy-paste commands and understand high-level architecture, but I don't write code. So you do all the technical work.

**Communication language:** English. But explain technical things simply, as if for a non-developer. When you use a technical term, briefly explain it in parentheses.

---

## 🎯 What We're Building

### Project Name: **Käte** (Kazakh for "pocket")

### One-liner
> *"Use Solana without SOL. Pay gas in USDC."*

### What the App Does

A mobile-native Android app (for Solana Seeker phone) that lets users:

1. Connect their Seeker wallet via Mobile Wallet Adapter (MWA)
2. Deposit USDC once ("charge their gas battery")
3. Use any Solana dApp **without** needing SOL for gas
4. See their "Gas Balance" in USDC in real-time

### Pitch
> *"Kora is the engine. Käte is the car."*

We're building **the first mobile-native UI layer** on top of Kora (Solana Foundation's official gasless infrastructure).

---

## 💰 Goal

### Financial Targets
- **Solana Mobile Builder Grant**: $10k (75% chance)
- **Solana Foundation Grant**: $20-50k (40% chance)
- **Superteam KZ Grant**: $5k (70% chance)
- **SKR Season 2 Builder Snapshot**: $30-60k (80% chance)

**Expected value: ~$62,000 for 21 days of work.**

### Strategic Goal
Become the first crypto builder from Central Asia in the Solana Mobile ecosystem. Build reputation as a Solana Mobile builder.

---

## 🏗️ Tech Stack

### Backend (gasless infrastructure)
- **Kora** by Solana Foundation (https://github.com/solana-foundation/kora)
  - License: MIT
  - Audited by Runtime Verification
  - Production-ready, current version v2.0.5
  - We do NOT write backend — we use the existing one
  - Deploy Kora node to Railway or AWS

### Frontend (mobile app)
- **Solana Mobile Expo Template** (https://github.com/solana-mobile/solana-mobile-expo-template)
  - React Native + Expo
  - Mobile Wallet Adapter (MWA) integrated
  - Pre-built components for ConnectWalletButton etc.

### SDK
- `@solana/kora` (TypeScript SDK for Kora) — main one
- `@solana-mobile/mobile-wallet-adapter-protocol` — for connecting to Seed Vault Wallet
- `@solana/web3.js` — for Solana operations

### Tools
- Bubblewrap (PWA → APK conversion)
- Solana dApp Publishing CLI (`@solana-mobile/dapp-store-publishing-tools-cli`)
- EAS Build (Expo build service)

---

## 🌍 Our Edge: Central Asia Focus

The app is in **English** to maximize global reach and grant readability, BUT our positioning and marketing focus is on **Central Asia**:

- I am based in Almaty, Kazakhstan
- Active member of Superteam KZ (Solana ecosystem hub)
- I have 2,000+ Twitter audience in crypto (CIS region)
- 5 years of crypto industry experience
- Connections to KZ/UZ/KG/TJ crypto communities

**This matters because:** none of the 188 builders who got SKR airdrop are from Central Asia. We're the first.

**Public good commitment** (for grant pitch):
- Open-source mobile-MWA-Kora integration boilerplate (first public example)
- Tutorial: "How to build a gasless Solana mobile dApp"
- Eventually (V2): localization JSON files for Russian, Kazakh, Uzbek, Kyrgyz, Tajik

---

## 📅 21-Day Roadmap

### Week 1: Foundation
- **Day 1**: Setup environment (Node, Rust, Solana CLI, Kora CLI), create GitHub repo, deploy Kora locally
- **Day 2-3**: Solana Mobile Expo Template setup, MWA integration, Hello World on Android emulator
- **Day 4-5**: UI screens — onboarding, dashboard, send transaction
- **Day 6-7**: Polish UI, error handling

### Week 2: Build
- **Day 8**: Twitter thread #1 (important for traction!)
- **Day 9-11**: Kora SDK integration in frontend, real gasless transactions working
- **Day 12-13**: Polishing UI, error handling, edge cases
- **Day 14**: Reach out to @a_milz and @dev_jodee on X to join Kora operators Slack

### Week 3: Ship & Apply
- **Day 15-16**: Beta testing with 5 friends from Superteam KZ, collect quotes/testimonials
- **Day 17**: Record 1-minute demo video, Twitter thread #2
- **Day 18**: Landing page on Vercel (`getkate.com` or similar)
- **Day 19**: Bubblewrap → APK build, signing
- **Day 20**: Submit to Solana dApp Store (via CLI)
- **Day 21**: **Submit 5 grant applications simultaneously**

---

## 🔥 Critical Features (MUST HAVE for grant)

### 1. Mobile Wallet Adapter (MWA) Integration
User must connect through Seed Vault Wallet on Seeker. This is a **mandatory** requirement from Solana Mobile.

### 2. Gas Balance Widget
The main UX innovation — user sees their USDC balance for gas in real-time. This is **our** design pattern (no analog exists).

### 3. Onboarding for Non-Crypto Users
Maximum 3 screens. Goal: user understands what the app does in 60 seconds.

### 4. SKR Integration in Roadmap (for V2, mention in grant)
- SKR Cashback (0.5% back on every transaction)
- SKR-as-Gas (advanced users can pay fees in SKR)
- Stake-to-Discount (staking SKR reduces gas fees)

### 5. Real Mainnet Transactions Working
The grant committee needs to see this is real — they will test it.

---

## ❌ What We DON'T Do (important!)

- ❌ Custom backend (we use Kora — it does everything)
- ❌ Custom smart contract (not needed)
- ❌ Custom token (no, we have grant strategy, not token strategy)
- ❌ Complex UX flows (simplicity > features)
- ❌ iOS version (Solana Mobile = Android only)
- ❌ Localization in V1 (English only — V2 will add 5 CIS languages as public good)

---

## 📱 UX Design — 3 Main Screens

### Screen 1: Onboarding (first open)
```
1. "Welcome to Käte"
   → Subtitle: "Use Solana without SOL"
   → Button: "Get Started"

2. "Connect your Seeker wallet"
   → MWA connect button: "Connect Wallet"
   → Explanation: "No SOL needed. All fees in USDC."

3. "Add USDC for gas"
   → "Deposit USDC to pay transaction fees"
   → Option: "Skip, I don't have USDC" → Solana Pay onramp
```

### Screen 2: Main Dashboard
```
┌─────────────────────────────────┐
│  Käte                       ⚙️   │
├─────────────────────────────────┤
│  💰 Gas Balance: 12.50 USDC      │
│  ⚡️ ~50,000 transactions left    │
│                                  │
│  [Send USDC]  [Send Token]      │
│  [Swap]       [Browse dApps]    │
│                                  │
│  🔗 Connected dApps:             │
│  ✓ Jupiter                       │
│  ✓ Drift                         │
│  + Add new dApp                  │
└─────────────────────────────────┘
```

### Screen 3: Send (the magic moment)
```
"Send 5 USDC to Anatoly.skr"

[Confirm] button → one tap → ✅
"Sent! Fee: $0.001 USDC"
```

---

## 🎨 Design System

### Colors
- Primary: `#9945FF` (Solana purple)
- Accent: `#14F195` (Solana green)
- Background light: `#FFFFFF`
- Background dark: `#0F0F0F`
- Text light: `#000000`
- Text dark: `#FFFFFF`

### Font
San Francisco (system default on Mac/iOS) or Inter (for Android).

### Icons
Lucide Icons (free, open source).

### Logo
Simple "Käte" text in Solana purple, optionally with a wallet icon.

---

## 🔑 Solana Mobile Grant Application Pitch (Draft)

```markdown
**Project:** Käte — Mobile-native gasless wallet for Solana

**Mission:**
Make Solana payments frictionless on mobile. We're building the first mobile-native UI layer on top of Kora (Solana Foundation's gasless infrastructure), starting with Central Asia as our launch market.

**What we built:**
- Mobile-first UI on top of Kora (Solana Foundation gasless infrastructure)
- Mobile Wallet Adapter integration with Seed Vault Wallet
- PWA → TWA APK for Solana dApp Store
- Live on Solana mainnet
- "Gas Balance" UX pattern — first of its kind on Solana Mobile

**Why us:**
- Based in Almaty (Solana ecosystem hub via Superteam KZ)
- 5 years in crypto industry
- Existing audience (2,000+ Twitter, active Superteam KZ member)
- First Central Asian team building Solana Mobile infrastructure

**Public Good Commitment:**
- Open-source mobile-MWA-Kora integration boilerplate (first public example)
- Tutorial: "Building gasless Solana mobile dApps with Kora"
- V2 roadmap: localization JSON files for 5 CIS languages (Russian, Kazakh, Uzbek, Kyrgyz, Tajik) — free for any Solana Mobile builder

**SKR Integration Roadmap (V2):**
- SKR Cashback: 0.5% back on every gasless transaction
- SKR-as-Gas: Advanced users can pay fees in SKR
- Stake-to-Discount: Staking SKR reduces gas fees

**Funds Requested:** $10,000

**Use of Funds:**
- $500: Mainnet deployment costs
- $3,000: Marketing in CIS markets (Twitter campaigns, KOL partnerships)
- $4,000: Development of V2 (full Seed Vault SDK integration, localization)
- $2,500: Community building events in Almaty (Superteam KZ workshops)

**Timeline:**
- Week 1-3: MVP shipped, 5 beta testers from Superteam KZ
- Week 4-8: 100 active users, V1.5 with bug fixes
- Week 9-12: V2 launch with SKR integration and CIS localization
- Q3 2026: 1,000 active users, expand to Uzbekistan and Kyrgyzstan markets
```

---

## ⚠️ Working Rules

### 1. **Ask permission before each destructive command**
If a command installs something globally, deletes files, or does git push — ask me first.

### 2. **Explain in simple words**
I'm not a developer. If you use a term — explain it in parentheses.
Example: "I'll install pnpm (a fast alternative to npm for package management)."

### 3. **Make small commits**
After each logical step — git commit with a clear message.

### 4. **Document progress**
Maintain a `PROGRESS.md` file logging what's done each day. This is needed for:
- Twitter threads (showing progress)
- Grant application (proving milestone completion)
- My memory (I don't remember between sessions)

### 5. **If you're stuck — say so**
Better to ask me (or have me reach out to strategic Claude through copy-paste in claude.ai chat) than silently get stuck.

### 6. **Save ALL progress screenshots**
Create a `screenshots/` folder in the project. When something works for the first time — take a screenshot. This is grant material and Twitter content.

### 7. **Speak English with me**
But explain things simply. I understand technical concepts but speak slowly with non-developer-friendly language.

---

## 📞 Connection Between Us and Strategic Claude

I have a **second Claude** (in claude.ai chat) that knows the full project history. When I need:
- Strategic decisions (changing plan, choosing features)
- Help writing grant pitches
- Help with Twitter content
- Situation analysis

→ I copy important output from here to there. They work together.

**You (Claude Code) = the executor.**
**Strategic Claude = the architect.**

---

## 🚀 First Step

When I say "Let's start with Day 1", you should:

1. Read this file completely
2. Create a `PROGRESS.md` file with Day 1 as the first entry
3. Install all needed tools (Node.js, pnpm, Rust, Solana CLI, Kora CLI)
4. Explain each step to me in English (simple language)
5. Ask permission before each command
6. Make first commit when basic setup is ready
7. Run Kora node locally and show me it works

---

## 💡 Final Thought

We're not just building an app. We're:
1. Getting grants ($60k+ expected value)
2. Building reputation as a Solana Mobile builder
3. Opening doors for other CIS developers in the Solana ecosystem
4. Creating real public good (open-source mobile gasless boilerplate)

This is a **3-week sprint with long-term value**. We do quality work, but fast.

**Let's go!** 🚀
