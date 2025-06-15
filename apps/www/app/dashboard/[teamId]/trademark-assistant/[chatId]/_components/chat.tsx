"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Chat } from "@galleo/ui/components/chat/chat";
import { useEffect, useRef } from "react";
import { posthogCapture } from "~/lib/client/posthog";
import { ROUTE_CHAT_BACKEND_API } from "~/lib/routes";

interface ChatInterfaceProps {
  teamId: string;
  chatId: string;
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
    reload,
  } = useChat({
    api: ROUTE_CHAT_BACKEND_API(teamId, chatId),
    id: chatId,
    initialMessages,
    sendExtraMessageFields: true,
    body: {
      teamId: teamId,
    },
    onToolCall({ toolCall }) {
      console.log("toolCall", toolCall);
    },
  });
  const runOnceRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: only trigger on mount
  useEffect(() => {
    if (initialMessages.length === 1 && !runOnceRef.current) {
      runOnceRef.current = true;
      reload();
    }
  }, []);
  console.log("messages", messages);
  const onSubmit =
    (input: string) =>
    (
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
    />
  );
}
