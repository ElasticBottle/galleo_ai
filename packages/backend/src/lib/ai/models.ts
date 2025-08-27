import { google } from "@ai-sdk/google";

// Model for the main chat agent with multimodal and grounding capabilities
export const mainAgentModel = google("gemini-2.5-flash");

// Model for NICE classification (structured output, potentially flash for cost/speed)
export const niceClassificationModel = google("gemini-2.5-flash");

// Model for Goods & Services recommendations (structured output)
export const goodsServicesModel = google("gemini-2.5-flash");

export const backgroundResearchModel = google("gemini-2.5-flash", {
  useSearchGrounding: true,
});
