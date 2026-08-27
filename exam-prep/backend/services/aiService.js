const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM_PROMPT = `You are an expert exam preparation tutor. Given a student's doubts, question paper text, and study plan, create a structured pre-examination revision guide.

Return ONLY valid JSON with this exact structure:
{
  "title": "Short descriptive title for this preparation session",
  "summary": "2-3 sentence overview of what will be covered",
  "studyPlan": [
    {
      "phase": "Phase name (e.g. Day 1: Fundamentals)",
      "duration": "Suggested time (e.g. 2 hours)",
      "topics": ["topic1", "topic2"],
      "focus": "What to focus on in this phase"
    }
  ],
  "postcards": [
    {
      "id": 1,
      "category": "Category name",
      "difficulty": "easy|medium|hard",
      "question": "Clear exam-style question",
      "answer": "Comprehensive answer with key points",
      "tip": "Quick revision tip or mnemonic",
      "relatedDoubt": "Optional: which user doubt this addresses"
    }
  ],
  "keyTakeaways": ["Important point 1", "Important point 2"],
  "practiceAdvice": "Final advice for the student before the exam"
}

Generate 8-12 postcards covering the most important concepts. Make questions exam-realistic and answers concise but complete.`;

function buildUserPrompt({ doubts, questionPaper, studyPlan, subject, examDate }) {
  const parts = [];

  if (subject) parts.push(`Subject/Exam: ${subject}`);
  if (examDate) parts.push(`Exam Date: ${examDate}`);
  if (doubts?.trim()) parts.push(`Student Doubts:\n${doubts.trim()}`);
  if (questionPaper?.trim()) parts.push(`Question Paper / Study Material:\n${questionPaper.trim()}`);
  if (studyPlan?.trim()) parts.push(`Student's Study Plan:\n${studyPlan.trim()}`);

  if (parts.length === 0) {
    throw new Error('Please provide at least one of: doubts, question paper, or study plan.');
  }

  return parts.join('\n\n');
}

async function callOpenAI(userPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from AI model.');
  }

  return JSON.parse(content);
}

function generateDemoPreparation({ doubts, questionPaper, studyPlan, subject }) {
  const inputText = [doubts, questionPaper, studyPlan].filter(Boolean).join(' ');
  const topics = extractTopics(inputText);

  return {
    title: subject ? `${subject} Exam Preparation` : 'Your Exam Preparation Guide',
    summary:
      'This demo preparation guide was generated locally. Add your OPENAI_API_KEY to unlock full AI-powered revision postcards tailored to your material.',
    studyPlan: [
      {
        phase: 'Phase 1: Core Concepts',
        duration: '2 hours',
        topics: topics.slice(0, 3).length ? topics.slice(0, 3) : ['Key definitions', 'Fundamental principles'],
        focus: 'Review definitions and build a strong foundation before tackling harder problems.',
      },
      {
        phase: 'Phase 2: Practice Questions',
        duration: '3 hours',
        topics: topics.slice(3, 6).length ? topics.slice(3, 6) : ['Problem solving', 'Application questions'],
        focus: 'Work through exam-style questions and check answers against your notes.',
      },
      {
        phase: 'Phase 3: Final Revision',
        duration: '1 hour',
        topics: ['Weak areas', 'Quick recall', 'Exam strategy'],
        focus: 'Flip through postcards, revisit doubts, and rest well before the exam.',
      },
    ],
    postcards: generateDemoPostcards(topics, doubts),
    keyTakeaways: [
      'Understand concepts before memorizing formulas.',
      'Practice timed questions to simulate exam conditions.',
      'Review your doubts list right before the exam.',
    ],
    practiceAdvice:
      'Use the flip postcards to test yourself. Cover the answer side, attempt each question, then check. Focus extra time on medium and hard cards.',
    demo: true,
  };
}

function extractTopics(text) {
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 5)
    .slice(0, 8);

  return [...new Set(words)].slice(0, 6);
}

function generateDemoPostcards(topics, doubts) {
  const basePostcards = [
    {
      id: 1,
      category: 'Fundamentals',
      difficulty: 'easy',
      question: 'What is the most important first step when starting exam preparation?',
      answer:
        'Create a structured study plan that allocates time to each topic based on weightage and your current understanding. Identify weak areas early.',
      tip: 'Use the 80/20 rule — focus on topics that cover most marks.',
      relatedDoubt: null,
    },
    {
      id: 2,
      category: 'Strategy',
      difficulty: 'medium',
      question: 'How should you approach a question you are unsure about during the exam?',
      answer:
        'Eliminate obviously wrong options first. Mark the question and return later if time permits. Never leave MCQs blank if there is no negative marking.',
      tip: 'Manage time — don\'t spend more than 2 minutes on a single MCQ.',
      relatedDoubt: null,
    },
    {
      id: 3,
      category: 'Revision',
      difficulty: 'easy',
      question: 'What is active recall and why is it effective for exam prep?',
      answer:
        'Active recall means testing yourself on material without looking at notes. It strengthens memory pathways far better than passive re-reading.',
      tip: 'Use these postcards — flip to hide the answer and quiz yourself.',
      relatedDoubt: null,
    },
    {
      id: 4,
      category: 'Application',
      difficulty: 'hard',
      question: 'How do you connect theoretical concepts to exam questions?',
      answer:
        'Map each concept to question types: definitions → short answers, processes → diagram questions, formulas → numerical problems. Practice each type separately.',
      tip: 'Create a concept-to-question-type matrix for your subject.',
      relatedDoubt: null,
    },
  ];

  topics.slice(0, 4).forEach((topic, i) => {
    basePostcards.push({
      id: 5 + i,
      category: 'Your Material',
      difficulty: i % 2 === 0 ? 'medium' : 'hard',
      question: `Explain the key concepts related to "${topic}" that could appear in your exam.`,
      answer: `Review your notes on ${topic}. Identify definitions, formulas, and common question patterns. Practice at least 3 questions on this topic before the exam.`,
      tip: `Make a one-page cheat sheet for ${topic} with only the essentials.`,
      relatedDoubt: null,
    });
  });

  if (doubts?.trim()) {
    const doubtLines = doubts
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean)
      .slice(0, 2);

    doubtLines.forEach((doubt, i) => {
      basePostcards.push({
        id: 20 + i,
        category: 'Your Doubts',
        difficulty: 'medium',
        question: `Clarify this doubt: ${doubt}`,
        answer:
          'Break this doubt into smaller parts. Find the prerequisite concept you might be missing. Look up 2-3 solved examples and explain the solution in your own words.',
        tip: 'Teaching the concept to someone else is the best way to resolve doubts.',
        relatedDoubt: doubt,
      });
    });
  }

  return basePostcards;
}

export async function generatePreparation(input) {
  const userPrompt = buildUserPrompt(input);

  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return generateDemoPreparation(input);
  }

  try {
    const result = await callOpenAI(userPrompt);
    return { ...result, demo: false };
  } catch (error) {
    console.error('AI generation failed, falling back to demo:', error.message);
    return { ...generateDemoPreparation(input), aiError: error.message };
  }
}
