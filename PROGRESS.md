# Käte — Progress Log

> Updated daily. Used for grant applications, Twitter threads, and memory between sessions.

---

## Day 1 — 2026-05-02: Environment Setup

### ✅ Completed
- [x] Created GitHub repository: https://github.com/Jasekeee/kate-app
  - Public, MIT license, Node .gitignore
- [x] Connected local folder to GitHub repo
- [x] CLAUDE.md committed (full project brief)
- [x] PROGRESS.md created

### ✅ Also Completed
- [x] Node.js v25.8.2 — already installed
- [x] pnpm v10.33.2 — installed via official installer
- [x] Rust 1.95.0 — installed via rustup
- [x] Solana CLI 3.1.14 — installed via official installer
- [x] Kora CLI 2.0.5 — installed via cargo (Rust package manager)
- [x] kora.toml config file created (devnet, USDC as gas token, Mock price source)
- [x] `kora config validate` — passed ✓

### 📝 Notes
- Stack: React Native + Expo (mobile app framework) + Kora (gasless backend by Solana Foundation)
- Target device: Solana Seeker (Android)
- Grant deadline: ~21 days from today (2026-05-23)

---

---

## Day 2 — 2026-05-02: App Scaffold + UI Screens

### ✅ Completed
- [x] Solana Mobile Expo Template scaffolded → `mobile/` folder
- [x] App renamed to "Käte", package `com.kate.wallet`, dark theme
- [x] Design system created (`theme.ts`) — Solana purple #9945FF, green #14F195, dark BG
- [x] **OnboardingScreen** — 3-step flow (Welcome → Connect → Gas)
- [x] **DashboardScreen** — Gas Balance widget (12.5 USDC / ~50k txs), action grid, connected dApps
- [x] **SendScreen** — recipient + amount input, fee preview, success state with ✅
- [x] **ConnectButton** component — wraps MWA with Käte styling
- [x] Navigation: Onboarding → Dashboard → Send → Settings
- [x] AsyncStorage: remembers if user has onboarded (won't show onboarding again)
- [x] TypeScript check: 0 errors
- [x] AsyncStorage installed (`@react-native-async-storage/async-storage`)

### 📝 Notes
- UI is fully built, using mock data for gas balance (real Kora integration = Day 9-11)
- MWA connect button works — requires physical Seeker device or Android emulator with Seed Vault
- All screens: dark mode only, Solana colors throughout

---

## Upcoming

### Day 3: Android Emulator + Hello World
- Install Java JDK (needed to run Android emulator)
- Set up Android Virtual Device (AVD) in Android Studio
- Run `pnpm run android` — see Käte on the emulator screen
- Take first screenshot (grant material!)

### Day 4-5: Polish + Real MWA test on Seeker
- Test connect flow end-to-end
- Error handling improvements

### Day 4-5: UI Screens
- Onboarding (3 screens)
- Main dashboard with Gas Balance widget
- Send transaction screen

### Week 2: Kora SDK Integration
- Real gasless transactions working
- Connect to Kora node

### Week 3: Ship & Apply
- Beta testing with 5 Superteam KZ members
- Demo video + landing page
- Submit to Solana dApp Store
- Submit 5 grant applications
