import posthog from "posthog-js";
import { env } from "../env";

export function getPosthog() {
  if (typeof window === "undefined") return posthog;
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    capture_pageview: true,
    autocapture: true,
  });
  return posthog;
}

export function posthogIdentify(
  userId: string,
  properties: Record<string, unknown>,
) {
  getPosthog().identify(userId, properties);
}

export function posthogGroup(
  groupType: string,
  groupKey: string,
  properties: Record<string, unknown>,
) {
  getPosthog().group(groupType, groupKey, properties);
}

export function posthogReset() {
  getPosthog().reset();
}

export type PostHogEventName =
  | "chat_created"
  | "chat_message_sent"
  | "chat_suggestion_clicked"
  | "chat_stopped"
  | "chat_attachment_added";
interface ChatMessageSentProperties {
  message: string;
  attachments?:
    | {
        name: string;
        type: string;
        size: number;
      }[]
    | undefined;
}
interface ChatSuggestionClickedProperties {
  content: string;
}
interface ChatAttachmentAddedProperties {
  attachments?:
    | {
        name: string;
        type: string;
        size: number;
      }[]
    | undefined;
}

type PostHogEventPropertiesMap = {
  chat_created: ChatMessageSentProperties;
  chat_message_sent: ChatMessageSentProperties;
  chat_suggestion_clicked: ChatSuggestionClickedProperties;
  chat_stopped: undefined; // Or an empty object: {}
  chat_attachment_added: ChatAttachmentAddedProperties;
};

export function posthogCapture<TEventName extends PostHogEventName>(
  eventName: TEventName,
  properties: PostHogEventPropertiesMap[TEventName],
) {
  getPosthog().capture(eventName, properties as Record<string, unknown>);
}
