# =========================================
# CONVERSATION TITLE
# =========================================

def generate_conversation_title(
    message: str,
) -> str:
    """
    Generate a simple conversation title from
    the user's first message.

    This is intentionally deterministic and does
    not call the LLM.
    """

    message = message.strip()

    if not message:
        return "New conversation"

    # -----------------------------------------
    # REMOVE EXTRA WHITESPACE
    # -----------------------------------------

    title = " ".join(
        message.split()
    )

    # -----------------------------------------
    # COMMON PORTFOLIO TOPICS
    # -----------------------------------------

    lower_message = title.lower()

    if any(
        phrase in lower_message
        for phrase in [
            "project",
            "projects",
        ]
    ):
        return "Projects"

    if any(
        phrase in lower_message
        for phrase in [
            "technology",
            "technologies",
            "tech stack",
            "tech stack",
            "framework",
            "programming language",
            "skills",
        ]
    ):
        return "Technologies & Skills"

    if any(
        phrase in lower_message
        for phrase in [
            "experience",
            "work experience",
            "internship",
            "job",
            "worked",
        ]
    ):
        return "Work Experience"

    if any(
        phrase in lower_message
        for phrase in [
            "education",
            "degree",
            "college",
            "university",
            "qualification",
        ]
    ):
        return "Education"

    # -----------------------------------------
    # USE FIRST MESSAGE AS TITLE
    # -----------------------------------------

    max_length = 60

    if len(title) <= max_length:
        return title

    truncated = title[:max_length].rsplit(
        " ",
        1,
    )[0]

    return f"{truncated}..."


# =========================================
# BUILD RETRIEVAL QUERY
# =========================================

def build_retrieval_query(
    question: str,
    conversation_history=None,
) -> str:
    """
    Build a better retrieval query using
    conversation history.

    The purpose is to resolve follow-up references
    such as:

    "it"
    "its"
    "that project"
    "this project"
    "he"
    "that"
    "this"
    """

    question = question.strip()

    if not conversation_history:
        return question

    # -----------------------------------------
    # LOOK FOR RECENT PROJECT MENTION
    # -----------------------------------------

    project_titles = [
        "FlowForge",
        "NewsNaut",
        "VisionMeet",
        "Sentinel AI Network IDS",
        "Atharva Portfolio",
    ]

    recent_text = ""

    # Only inspect the most recent messages.
    for message in conversation_history[-6:]:

        content = message.get(
            "content",
            "",
        )

        if content:
            recent_text += " " + content

    # -----------------------------------------
    # FIND PROJECT MENTION
    # -----------------------------------------

    mentioned_project = None

    recent_lower = recent_text.lower()

    for project in project_titles:

        if project.lower() in recent_lower:

            mentioned_project = project
            break

    # -----------------------------------------
    # FOLLOW-UP QUESTION
    # -----------------------------------------

    follow_up_phrases = [
        "it",
        "its",
        "it's",
        "that project",
        "this project",
        "the project",
        "that",
        "this",
    ]

    question_lower = question.lower()

    is_follow_up = any(
        phrase in question_lower
        for phrase in follow_up_phrases
    )

    # -----------------------------------------
    # BUILD RESOLVED QUERY
    # -----------------------------------------

    if (
        mentioned_project
        and is_follow_up
    ):

        return (
            f"{mentioned_project} "
            f"{question}"
        )

    return question