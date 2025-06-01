"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Chat } from "@galleo/ui/components/chat/chat";
import { useEffect, useRef } from "react";
import { backend } from "~/lib/client/backend";
import { posthogCapture } from "~/lib/client/posthog";

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
  console.log("initialMessages", initialMessages);
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
    api: backend.api[":teamId"].chat[":chatId"].$url({
      param: {
        teamId,
        chatId,
      },
    }).href,
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
