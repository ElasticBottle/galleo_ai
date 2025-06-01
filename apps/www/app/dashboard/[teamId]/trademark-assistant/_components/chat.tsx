"use client";

import { useChat } from "@ai-sdk/react";
import { Chat } from "@galleo/ui/components/chat/chat";
import { backend } from "~/lib/client/backend";
import { posthogCapture } from "~/lib/client/posthog";

export function ChatInterface() {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    append,
  } = useChat({
    api: backend.api.chat.$url().href,
    onToolCall({ toolCall }) {
      console.log("toolCall", toolCall);
    },
  });
  const onSubmit = (
    e: { preventDefault?: () => void } | undefined,
    options?: { experimental_attachments?: FileList },
  ) => {
    e?.preventDefault?.();
    posthogCapture("chat_message_sent", {
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
    append(userMessage);
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
      handleSubmit={onSubmit}
      messages={messages}
      setMessages={setMessages}
      input={input}
      handleInputChange={handleInputChange}
      stop={onStop}
      isGenerating={status === "streaming"}
      onFileAttachment={onAttachment}
      suggestion={{
        label: "Suggestions to get you started",
        append: onSuggestionClick,
        suggestions: [
          "Find me the relevant pre-approved list of goods and services for a soya bean food business under the class 29",
          "Help me draft a pre-filling advice email for a client who is applying for a trademark for FairPrice, the supermarket chain",
          "Do a deep dive into the company Thirdweb and generate a report on the background of the company.",
        ],
      }}
    />
  );
}
