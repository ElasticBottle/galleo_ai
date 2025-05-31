"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { type ReactElement, useCallback, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";
import type { Message } from "./chat-message";
import { ChatMessageInput } from "./chat-message-input";
import { ChatMessageList, ChatMessageListContainer } from "./chat-message-list";
import { CopyButton } from "./copy-button";
import { PromptSuggestions } from "./prompt-suggestions";

interface ChatProps {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList },
  ) => void;
  messages: Message[];
  setMessages?: (messages: Message[]) => void;
  input: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: "thumbs-up" | "thumbs-down",
  ) => void;
  transcribeAudio?: (blob: Blob) => Promise<string>;
  suggestion?: {
    label: string;
    append: (message: { role: "user"; content: string }) => void;
    suggestions: string[];
  };
}

export function Chat({
  messages,
  setMessages,
  input,
  handleInputChange,
  stop,
  handleSubmit,
  isGenerating,
  suggestion,
  className,
  onRateResponse,
  transcribeAudio,
}: ChatProps) {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Enhanced stop function that marks pending tool calls as cancelled
  const handleStop = useCallback(() => {
    stop?.();

    if (!setMessages) return;
    const latestMessages = [...messagesRef.current];
    const lastAssistantMessage = latestMessages.findLast(
      (m) => m.role === "assistant",
    );
    if (!lastAssistantMessage) return;
    const updatedMessage = { ...lastAssistantMessage };

    if (lastAssistantMessage.parts && lastAssistantMessage.parts.length > 0) {
      updatedMessage.parts = lastAssistantMessage.parts.map((part) => {
        if (
          part.type === "tool-invocation" &&
          part.toolInvocation.state === "call"
        ) {
          return {
            ...part,
            toolInvocation: {
              ...part.toolInvocation,
              state: "result",
              result: {
                content: "Tool execution was cancelled",
                __cancelled: true,
              },
            },
          };
        }
        return part;
      });
    }

    setMessages(
      latestMessages.map((message) => {
        if (message.id === lastAssistantMessage.id) {
          return updatedMessage;
        }
        return message;
      }),
    );
  }, [stop, setMessages]);

  const messageOptions = useCallback(
    (message: Message) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1">
            <CopyButton
              content={message.content}
              copyMessage="Copied response to clipboard!"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-up")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-down")}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton
          content={message.content}
          copyMessage="Copied response to clipboard!"
        />
      ),
    }),
    [onRateResponse],
  );

  return (
    <div
      className={cn(
        "flex h-full max-h-screen w-full flex-col gap-3",
        className,
      )}
    >
      {isEmpty && suggestion ? (
        <PromptSuggestions
          label={suggestion.label}
          append={suggestion.append}
          suggestions={suggestion.suggestions}
        />
      ) : null}

      {messages.length > 0 ? (
        <ChatMessageListContainer messages={messages}>
          <ChatMessageList
            messages={messages}
            isTyping={isTyping}
            messageOptions={messageOptions}
          />
        </ChatMessageListContainer>
      ) : null}

      <ChatForm
        className="mt-auto"
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}
      >
        {({ files, setFiles }) => (
          <ChatMessageInput
            placeholder="Ask Galleo anything about trademarks..."
            value={input}
            onChange={handleInputChange}
            attachments={{
              files,
              setFiles,
            }}
            stop={handleStop}
            isGenerating={isGenerating}
            transcribeAudio={transcribeAudio}
          />
        )}
      </ChatForm>
    </div>
  );
}
Chat.displayName = "Chat";

function createFileList(files: File[] | FileList): FileList {
  const dataTransfer = new DataTransfer();
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}

interface ChatFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "children" | "onSubmit"> {
  isPending: boolean;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    options?: { experimental_attachments?: FileList },
  ) => void;
  children: (props: {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  }) => ReactElement;
}

export const ChatForm = ({
  children,
  handleSubmit,
  isPending,
  className,
  ...formProps
}: ChatFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const fileList = createFileList(files);
    handleSubmit(event, { experimental_attachments: fileList });
    setFiles([]);
  };

  return (
    <form onSubmit={handleFormSubmit} className={className} {...formProps}>
      {children({ files, setFiles })}
    </form>
  );
};
ChatForm.displayName = "ChatForm";
