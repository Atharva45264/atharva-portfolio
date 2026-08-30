def build_retrieval_query(
    question: str,
    conversation_history=None,
) -> str:
    """
    Build a conversation-aware retrieval query.

    Resolves follow-up references such as:
    - it
    - its
    - it's
    - that project
    - this project
    - the project
    - that
    - this

    The most recently mentioned project is used as the
    conversation subject.
    """

    question = question.strip()

    if not conversation_history:
        return question

    # -----------------------------------------
    # KNOWN PROJECTS
    # -----------------------------------------

    project_titles = [
        "FlowForge",
        "NewsNaut",
        "VisionMeet",
        "Sentinel AI Network IDS",
        "Atharva Portfolio",
    ]

    # -----------------------------------------
    # FIND MOST RECENT PROJECT
    # -----------------------------------------

    mentioned_project = None

    # Search newest messages first.
    for message in reversed(conversation_history[-10:]):

        content = message.get(
            "content",
            "",
        )

        if not content:
            continue

        content_lower = content.lower()

        # Check all known projects.
        # Because we're checking newest messages first,
        # the first match is the most recent project context.
        for project in project_titles:

            if project.lower() in content_lower:
                mentioned_project = project
                break

        if mentioned_project:
            break

    # -----------------------------------------
    # FOLLOW-UP DETECTION
    # -----------------------------------------

    question_lower = question.lower()

    follow_up_phrases = [
        " it ",
        " its ",
        " it's ",
        "it?",
        "its?",
        "it's?",
        "that project",
        "this project",
        "the project",
        "that",
        "this",
        "its ",
        "it's ",
    ]

    is_follow_up = any(
        phrase in question_lower
        for phrase in follow_up_phrases
    )

    # -----------------------------------------
    # RESOLVE FOLLOW-UP
    # -----------------------------------------

    if mentioned_project and is_follow_up:

        return (
            f"{mentioned_project}: "
            f"{question}"
        )

    return question