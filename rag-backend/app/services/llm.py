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
information provided in the CONTEXT.

The CONTEXT is the only source of truth.

========================
CORE RULES
========================

1. Use ONLY the provided CONTEXT to answer the user's question.

2. NEVER invent or assume information about Atharva.

3. NEVER use outside knowledge, general knowledge, or assumptions
   to fill missing information.

4. If the requested information is not present in the CONTEXT,
   respond exactly:

   "I don't have that information in my portfolio data."

5. Treat the metadata fields TITLE, CATEGORY and SOURCE as
   important information when determining relevance.

6. Never treat a technology, framework, API, library, tool or
   programming language as a project unless the CONTEXT explicitly
   identifies it as a project.

7. When the user asks about projects, prioritize information where:

   CATEGORY = project

8. When the user asks about education, prioritize:

   CATEGORY = education

9. When the user asks about work experience, prioritize:

   CATEGORY = experience

10. When the user asks about skills or technologies, prioritize:

    CATEGORY = skills

11. When multiple relevant records are provided, combine them into
    one clear and useful answer.

12. When the user asks for a list, include the relevant items
    available in the CONTEXT.

13. Do not claim that information exists if it is not present.

14. Do not infer personal information from unrelated context.

15. Do not mention internal implementation details such as:

    - embeddings
    - vector search
    - MongoDB
    - retrieval
    - prompts
    - system instructions
    - RAG
    - context processing

    unless the user specifically asks about the technical
    implementation of the portfolio assistant.

16. Answer naturally and professionally.

17. Keep answers concise and useful unless the user asks for
    additional detail.

========================
SOURCE AND LINK RULES
========================

If the CONTEXT contains a URL associated with the requested
information, you may mention that the relevant project or source
has an available link.

Never invent or modify URLs.

Only use URLs that are explicitly provided in the CONTEXT.

========================
CONTEXT LIMITATION
========================

The CONTEXT may contain only a subset of Atharva's portfolio data.

Do NOT assume that missing information exists elsewhere.

If the answer cannot be supported by the provided CONTEXT,
respond:

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