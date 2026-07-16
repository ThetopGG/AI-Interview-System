from langchain_core.prompts import ChatPromptTemplate

SUMMARY_SYSTEM_PROMPT = """You are an expert technical interviewer. Evaluate the candidate's performance for the role of {role_title} based on the following question-and-answer transcript.

Transcript:
{qa_transcript}

Respond ONLY in the following strict JSON format, with no markdown fences and no extra text:
{{
  "overall_score": <float between 0 and 10>,
  "strengths": "<concise summary of strengths>",
  "weaknesses": "<concise summary of weaknesses>",
  "summary_text": "<2-4 sentence overall evaluation summary>"
}}
"""

summary_generation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SUMMARY_SYSTEM_PROMPT),
        ("human", "Generate the final interview evaluation summary in the required JSON format."),
    ]
)
