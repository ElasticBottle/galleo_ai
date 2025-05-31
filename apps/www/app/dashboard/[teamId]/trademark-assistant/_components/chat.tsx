"use client";

import { useChat } from "@ai-sdk/react";
import { Chat } from "@galleo/ui/components/chat/chat";
import { backend } from "~/lib/client/backend";

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
  console.log("messages", messages);

  return (
    <Chat
      handleSubmit={handleSubmit}
      messages={messages}
      setMessages={setMessages}
      input={input}
      handleInputChange={handleInputChange}
      stop={stop}
      isGenerating={status === "streaming"}
      suggestion={{
        label: "Try these prompts ✨",
        append: append,
        suggestions: ["What is the capital of France?", "Tell me a joke"],
      }}
    />
  );
}
