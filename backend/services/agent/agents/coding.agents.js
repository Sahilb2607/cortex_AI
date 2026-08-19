import { getmodel } from "../config/model.js";
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const CodingAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "coding");
    const intentllm = await getmodel("intent");
    const llm = await getmodel("coding");
    const intentRes = await intentllm.invoke(
      `You are an intent classifier.
    Return ONLY one of these values.

    CODE_GENERATION
    CODE_REVIEW
    CODE_EXPLANATION
    DEBUGGING
    OPTIMIZATION
    CONVERSION
    DOCUMENTATION

    User Request:${state.prompt}
    `,
    );
    const result = intentRes.content;
    if (result == "CODE_GENERATION") {
      const prompt = `
"You are CortexAI Coding Agent."

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:
- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

IMAGES
==========================================
Always use real Unsplash images
Never use placeholders

Return ONLY valid JSON

Schema:

{
  "files":[
    {
      "name":"index.html",
      "content":"..."
    },
    {
      "name":"style.css",
      "content":"..."
    },
    {
      "name":"script.js",
      "content":"..."
    }
  ]
}

Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent



User Request:${state.prompt}

`;

      const response = await llm.invoke(prompt);
      await reductCredit(state.userId, "coding");
      let content = response.content.trim();

      // Remove markdown code fences if present
      content = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "");

      console.log(content); // Debug

      const conres = JSON.parse(content);
      return {
        ...state,
        AImessage: "Code Generated Sucessfully",
        Artifacts: [
          {
            id: Date.now(),
            type: "Project",
            files: conres.files || [],
            title: state.prompt,
          },
        ],
      };
    }
    const res = await intentllm.invoke(`
    The user's request is:

${result}

Return Markdown only.
Never generate project files.
Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)
User Request:
${state.prompt}
`);
    await reductCredit(state.userId, "coding");
    return {
      ...state,
      AImessage: res.content,
      Artifacts: [],
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      AImessage: error?.data?.message || "Failed to generate response!!!..",
      Artifacts: [],
    };
  }
};
