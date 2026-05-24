# StudyAI 🧠

An AI-powered study assistant that turns your notes into summaries, flashcards, and quizzes.

Built with React + Claude API. Great for your portfolio as a CS grad.

---

## Tech Stack

- **Frontend**: React 18
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Storage**: localStorage (upgrade to Supabase later)
- **Fonts**: Syne + DM Sans (Google Fonts)

---

## Setup Instructions

### 1. Prerequisites

Make sure you have Node.js installed. Check by running:
```bash
node --version   # should be 16+
npm --version
```

If not installed, download from: https://nodejs.org

### 2. Get an Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### 3. Clone / Set Up This Project

```bash
# Navigate to the project folder
cd studyai

# Install dependencies
npm install
```

### 4. Add Your API Key

Open the `.env` file and replace the placeholder:

```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

**Important**: Never commit your `.env` file to GitHub. The `.gitignore` covers this.

### 5. Run the App

```bash
npm start
```

The app opens at **http://localhost:3000** 🎉

---

## How to Use

1. **Input Notes tab** — paste any study notes or text
2. Click **Summarise + Generate Study Set**
3. Switch to **Flashcards** — tap each card to reveal the answer
4. Switch to **Quiz** — answer the multiple choice questions
5. Check **Progress** to track your sessions and scores

---

## Project Structure

```
studyai/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── claude.js          ← Anthropic API calls
│   ├── components/
│   │   ├── InputTab.jsx       ← Note input + summary
│   │   ├── FlashcardsTab.jsx  ← Flashcard UI
│   │   ├── QuizTab.jsx        ← Quiz UI
│   │   └── ProgressTab.jsx    ← Stats + session log
│   ├── App.jsx                ← Main app + state management
│   ├── App.css                ← All styles
│   ├── index.js               ← Entry point
│   └── index.css              ← Global reset
├── .env                       ← Your API key (DO NOT COMMIT)
├── .gitignore
└── package.json
```

---

## Next Steps (to make it portfolio-ready)

### Add a Backend (recommended before deploying)
Move the API call to a Node.js/Express server so your API key isn't exposed client-side.

```bash
# In a new folder
mkdir studyai-backend
cd studyai-backend
npm init -y
npm install express cors dotenv node-fetch
```

### Add a Database
Sign up at https://supabase.com (free tier) to store:
- User accounts (auth)
- Saved notes
- Quiz history

### Deploy
- Frontend → [Vercel](https://vercel.com) (free, drag and drop)
- Backend → [Railway](https://railway.app) or [Render](https://render.com)

---

## Interview Talking Points

- "I integrated the Anthropic Claude API to generate structured JSON output (summaries, flashcards, quizzes) from unstructured text"
- "I used React state and localStorage for session persistence, with a clear upgrade path to Supabase"
- "The prompt engineering uses structured output constraints to ensure reliable JSON parsing"
- "I designed a component architecture that separates API logic, UI components, and state management"
