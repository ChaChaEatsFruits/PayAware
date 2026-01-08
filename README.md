# PayAware - Ethical Financial Awareness Platform

<img src="" alt="Alt text" width="500"/>

## 1. Problem Statement & Domain
**Domain**: Personal Finance / Fintech

Financial anxiety is rising, and users often feel disconnected from their spending habits. Traditional banking apps are cluttered and focus on transaction lists rather than awareness.

**PayAware** addresses this by providing a "Secure, Ethical, Awareness-First" dashboard. It uses Voice AI to make logging expenses effortless and provides immediate feedback on financial health (Income vs. Expense) without dark patterns or overwhelming data.

---

## 2. Key Features
* **🗣️ Hands-Free Logging**: Integrated **Vapi.ai** voice agent that listens, understands, and logs expenses in real-time.
* **🛡️ Ethical Guardrails**: The AI proactively checks your balance *before* logging an expense, warning you if funds are insufficient.
* **⚡ Real-Time Dashboard**: Powered by **Next.js 15 Server Actions**, the UI updates instantly without page reloads.
* **🔒 Bank-Grade Security**: Uses **Supabase Row Level Security (RLS)** to ensure users can strictly access only their own financial data.

---

## 3. System Architecture Overview
The application follows a modern, scalable micro-services architecture:

-   **Frontend**: Next.js 15 (App Router) for server-side rendering and robust routing.
-   **Styling**: Tailwind CSS v4 with Shadcn UI and Framer Motion for premium, responsive animations.
-   **Backend / Database**: Supabase (PostgreSQL) for relational data and authentication.
-   **AI Integration**: Vapi.ai for real-time voice-to-action processing.
-   **Infrastructure**: Fully containerized with Docker.

**Data Flow**:
1.  **User Interaction**: User logs in securely via Supabase Auth.
2.  **Voice Command**: User speaks ("I spent 500 rupees on food").
3.  **Processing**: Vapi.ai converts speech to intent and calls the `/api/ai/vapi` webhook.
4.  **Validation**: The system checks the user's current balance against the requested expense.
5.  **Execution**: Valid transactions are committed to Supabase; invalid ones trigger a voice warning.

---

## 4. Setup & Testing Instructions

### Option A: Quick Start (Docker) 🐳
*Prerequisite: Docker & Docker Compose installed.*

1.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    # Optional
    GOOGLE_AI_API_KEY=your_gemini_key
    ```

2.  **Start Application**:
    ```bash
    docker-compose up --build
    ```
    Access the app at `http://localhost:3000`.

### Option B: Manual Setup (Local Dev) 💻
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Setup `.env` as described above.
3.  Run development server:
    ```bash
    npm run dev
    ```
4.  Access at `http://localhost:3000`.

### Testing the Application
-   **Dashboard Load**: Open the dashboard. You should see "0" or your current balance (not loading errors).
-   **Voice Test**: Click the **Mic Orb**. Speak a command like *"Add an expense of 500 for lunch."*
    -   *Success:* The AI confirms "Logged" and the transaction appears instantly.
    -   *Failure:* If you say an amount higher than your balance, the AI should warn you.

---

## 5. Assumptions and Known Limitations
-   **Currency**: The app defaults to INR (Rupees) for all prompts and formatting.
-   **Authentication**: Currently supports Email/Password auth via Supabase.
-   **Voice Latency**: Performance depends on internet speed and Vapi.ai server load.
-   **Compliance**: This is a prototype; strictly for educational/hackathon purposes and not a licensed banking product.

---

*Built for Build2Break 2026*
