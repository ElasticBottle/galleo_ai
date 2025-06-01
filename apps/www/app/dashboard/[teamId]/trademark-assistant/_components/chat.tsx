"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Chat } from "@galleo/ui/components/chat/chat";
import { backend } from "~/lib/client/backend";
import { posthogCapture } from "~/lib/client/posthog";

interface ChatInterfaceProps {
  teamId: string;
  chatId?: string;
  initialMessages: Message[];
}

export function ChatInterface({
  teamId,
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
  } = useChat({
    api: chatId
      ? backend.api[":teamId"].chat[":chatId"].$url({
          param: {
            teamId,
            chatId,
          },
        }).href
      : backend.api[":teamId"].chat.$url({
          param: {
            teamId,
          },
        }).href,
    ...(chatId ? { id: chatId } : {}),
    initialMessages,
    sendExtraMessageFields: true,
    body: {
      teamId: teamId,
    },
    onToolCall({ toolCall }) {
      console.log("toolCall", toolCall);
    },
  });

  const onSubmit =
    (input: string) =>
    (
      e: { preventDefault?: () => void } | undefined,
      options?: { experimental_attachments?: FileList },
    ) => {
      e?.preventDefault?.();
      posthogCapture(chatId ? "chat_message_sent" : "chat_created", {
        message: input,
        attachments: Array.from(options?.experimental_attachments ?? []).map(
          (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
          }),
        ),
      });
      handleSubmit(e, options);
    };

  const onSuggestionClick = (userMessage: {
    content: string;
    role: "user";
  }) => {
    posthogCapture("chat_suggestion_clicked", {
      content: userMessage.content,
    });
    onSubmit(userMessage.content)(undefined, {});
  };

  const onStop = () => {
    posthogCapture("chat_stopped", undefined);
    stop();
  };

  const onAttachment = (attachments?: File[]) => {
    posthogCapture("chat_attachment_added", {
      attachments: attachments?.map((attachment) => ({
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      })),
    });
  };

  return (
    <Chat
      className="flex-1"
      handleSubmit={onSubmit(input)}
      messages={messages}
      setMessages={setMessages}
      input={input}
      handleInputChange={handleInputChange}
      stop={onStop}
      isGenerating={status === "submitted" || status === "streaming"}
      onFileAttachment={onAttachment}
      {...(chatId
        ? {}
        : {
            suggestion: {
              label: "Suggestions to get you started",
              append: onSuggestionClick,
              suggestions: [
                "Find me the relevant pre-approved list of goods and services for a soya bean food business under the class 29",
                "Help me draft a pre-filling advice email for a client who is applying for a trademark for FairPrice, the supermarket chain",
                "Do a deep dive into the company Thirdweb and generate a report on the background of the company.",
              ],
            },
          })}
    />
  );
}
