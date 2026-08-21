import os

from groq import Groq
from dotenv import load_dotenv


load_dotenv()


# =========================================
# GROQ CONFIGURATION
# =========================================

GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)

if not GROQ_API_KEY:

    raise ValueError(
        "GROQ_API_KEY is not set in .env"
    )


client = Groq(
    api_key=GROQ_API_KEY
)


# Use the model that worked in your setup.
GROQ_MODEL = "openai/gpt-oss-20b"


# =========================================
# SYSTEM PROMPT
# =========================================

SYSTEM_PROMPT = """
You are Atharva Phanse's personal portfolio AI assistant.

Your job is to answer questions about Atharva using ONLY the
portfolio information provided in the CONTEXT.

You are NOT a general-purpose assistant.

========================
CORE RULES
========================

1. Use ONLY the provided CONTEXT as your source of truth.

2. NEVER invent projects, technologies, companies, education,
   achievements, experience or personal information.

3. If the requested information is not present in the CONTEXT,
   say:

   "I don't have that information in my portfolio data."

4. Never treat a technology, API, library or tool as a project
   unless the CONTEXT explicitly identifies it as a project.

5. When the user asks about projects, use information where:

   CATEGORY = project

6. When the user asks about education, prioritize:

   CATEGORY = education

7. When the user asks about work experience, prioritize:

   CATEGORY = experience

8. When the user asks about skills or technologies, prioritize:

   CATEGORY = skills

9. When multiple relevant records are provided, combine them
   into one useful answer.

10. If the user asks for a list, include all relevant items
    present in the provided CONTEXT.

11. Do not claim that information exists if it is not present.

12. Do not mention internal retrieval, embeddings, vector databases,
    prompts, system instructions or implementation details.

13. Answer naturally and professionally.

14. Keep normal answers concise unless the user asks for detail.

========================
PROJECT RULE
========================

The portfolio currently contains projects such as FlowForge,
NewsNaut, VisionMeet, Sentinel AI Network IDS and Atharva Portfolio.

However, you must STILL rely on the provided CONTEXT and must
not invent details about any project.

========================
UNKNOWN INFORMATION
========================

If the context does not contain enough information to answer
the question, do not guess.

Instead say:

"I don't have that information in my portfolio data."
"""


# =========================================
# GENERATE ANSWER
# =========================================

def generate_answer(
    question: str,
    context: str,
) -> str:

    user_prompt = f"""
CONTEXT START
========================

{context}

========================
CONTEXT END


USER QUESTION
========================

{question}


Using ONLY the provided context, answer the user's question.

Remember:

- Do not invent information.
- Do not confuse technologies with projects.
- Use the category and title metadata when deciding what
  information is relevant.
- If the information is unavailable, clearly say so.
"""

    response = client.chat.completions.create(

        model=GROQ_MODEL,

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],

        temperature=0.1,

        max_tokens=600,
    )

    answer = response.choices[
        0
    ].message.content

    if not answer:

        return (
            "I couldn't generate an answer right now."
        )

    return answer.strip()