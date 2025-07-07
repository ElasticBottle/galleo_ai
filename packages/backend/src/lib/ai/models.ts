import { google } from "@ai-sdk/google";

// Model for the main chat agent with multimodal and grounding capabilities
export const mainAgentModel = google("gemini-2.5-flash-preview-04-17");

// Model for NICE classification (structured output, potentially flash for cost/speed)
export const niceClassificationModel = google("gemini-2.5-flash-preview-04-17");

// Model for Goods & Services recommendations (structured output)
export const goodsServicesModel = google("gemini-2.5-flash-preview-04-17");

export const backgroundResearchModel = google(
  "gemini-2.5-flash-preview-04-17",
  {
    useSearchGrounding: true,
  },
);
