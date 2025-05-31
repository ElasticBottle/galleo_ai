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
      className="flex-1"
      handleSubmit={handleSubmit}
      messages={messages}
      setMessages={setMessages}
      input={input}
      handleInputChange={handleInputChange}
      stop={stop}
      isGenerating={status === "streaming"}
      suggestion={{
        label: "Suggestions to get you started",
        append: append,
        suggestions: [
          "Find me the relevant pre-approved list of goods and services for a soya bean food business under the class 29",
          "Help me draft a pre-filling advice email for a client who is applying for a trademark for FairPrice, the supermarket chain",
          "Do a deep dive into the company OKX and tell me about its goods and services",
        ],
      }}
    />
  );
}
