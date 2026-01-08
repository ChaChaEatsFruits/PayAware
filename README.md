# PayAware - Ethical Financial Awareness Platform

<img width="2261" height="3354" alt="image" src="https://github.com/user-attachments/assets/7b98b816-7412-42cb-8b30-8a24d62bcc4d" />



## 🔗 Live Demo
**[Insert Your Vercel/Ngrok Public Link Here]**
*(Judge Access: No login required for guest mode / Use credentials: `demo@payaware.com` / `hackathon2026`)*

---

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

## 4. Setup & Deployment Instructions

### ⚠️ Security Note
This project strictly avoids hard-coded secrets. You **MUST** create a `.env` file based on the example below before running.

### Option A: Docker (Preferred Method) 🐳
*This method spins up the entire stack with a single command.*

1.  **Configure Environment**:
    Create a `.env` file in the root directory.
    
    > **⚠️ Security Warning:** Never commit your `.env` file. Use the template below.

    ```env
    # ------------------------------
    # 1. Supabase (Database & Auth)
    # ------------------------------
    NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
    
    
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key

    # ------------------------------
    # 2. AI Integration
    # ------------------------------
    # Used for Voice Agent (Vapi.ai)
    NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
    
    # Used for Insights (Gemini)
    GOOGLE_AI_API_KEY=your_gemini_api_key

    # ------------------------------
    # 3. Payments (Razorpay)
    # ------------------------------
    # Public key for frontend checkout
    NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
    
    # Secret key for verifying payments (Server-side only)
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    ```

2.  **Start Application**:
    ```bash
    docker-compose up --build
    ```
    Access the app at `http://localhost:3000`.

### Option B: Manual Setup (Local Dev) 💻
1.  Install dependencies: `npm install`
2.  Setup `.env` as described above.
3.  Run development server: `npm run dev`
4.  Access at `http://localhost:3000`.

---

## 5. Design Decisions & Trade-offs
*To align with development rules requiring justification of design choices:*

* **Next.js App Router**: Chosen for its **Server Actions** capability, allowing us to execute secure database operations without exposing API endpoints for every small task.
* **Supabase over Custom Backend**: We prioritized **Correctness and Reliability**. Supabase's Auth and RLS (Row Level Security) are battle-tested, reducing the risk of custom security vulnerabilities.
* **Vapi.ai Integration**: Instead of building a custom STT/TTS pipeline (which is error-prone), we used Vapi to ensure **low-latency** voice interactions, crucial for a friction-free user experience.
* **Ethical AI Layer**: We explicitly restricted the AI's "Temperature" to 0.0 and implemented strict system prompts to prevent "hallucinations" or unauthorized financial advice.

---

## 6. Assumptions and Compliance
* **Originality**: This solution was originally conceived and built by the team specifically for Build2Break '26. No pre-existing projects were used.
* **Currency**: The app defaults to INR (Rupees) for all prompts and formatting.
* **Voice Latency**: Performance depends on internet speed and Vapi.ai server load.
* **Compliance**: This is a prototype; strictly for educational/hackathon purposes and not a licensed banking product.

---

*Built for Build2Break 2026*
