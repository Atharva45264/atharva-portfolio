def detect_intent(question: str) -> str:
    """
    Detect the broad category of a portfolio question.
    """

    question = question.lower()

    project_keywords = [
        "project",
        "projects",
        "built",
        "build",
        "developed",
        "application",
        "app",
        "website",
        "platform",
        "system",
        "flowforge",
        "newsnaut",
        "visionmeet",
        "sentinel",
    ]

    education_keywords = [
        "education",
        "degree",
        "college",
        "university",
        "study",
        "studied",
        "cgpa",
        "academic",
    ]

    experience_keywords = [
        "experience",
        "internship",
        "intern",
        "worked",
        "work",
        "company",
        "job",
        "role",
    ]

    skills_keywords = [
        "skill",
        "skills",
        "technology",
        "technologies",
        "tech stack",
        "programming language",
        "framework",
        "database",
        "tools",
    ]

    if any(
        keyword in question
        for keyword in project_keywords
    ):
        return "project"

    if any(
        keyword in question
        for keyword in education_keywords
    ):
        return "education"

    if any(
        keyword in question
        for keyword in experience_keywords
    ):
        return "experience"

    if any(
        keyword in question
        for keyword in skills_keywords
    ):
        return "skills"

    return "general"