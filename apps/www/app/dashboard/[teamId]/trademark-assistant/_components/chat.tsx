"use client";

import type { Message } from "@ai-sdk/react";
import { Chat } from "@galleo/ui/components/chat/chat";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backend } from "~/lib/client/backend";
import { posthogCapture } from "~/lib/client/posthog";
import { ROUTE_TRADEMARK_ASSISTANT_CHAT } from "~/lib/routes";

interface ChatInterfaceProps {
  teamId: string;
}

const convertFilesToAttachments = async (files?: FileList) => {
  return await Promise.all(
    Array.from(files ?? []).map(async (file) => {
      const { name, type } = file;

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          resolve(readerEvent.target?.result as string);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      return {
        name,
        contentType: type,
        url: dataUrl,
      };
    }),
  );
};
export function CreateChatInterface({ teamId }: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const { mutate: createChat, isPending } = useMutation({
    mutationFn: async ({
      input,
      attachments,
    }: {
      input: string;
      attachments?: FileList;
    }) => {
      const parsedAttachments = await convertFilesToAttachments(attachments);
      const response = await backend.api[":teamId"].chat.$post({
        param: {
          teamId,
        },
        json: {
          messages: [
            {
              content: input,
              attachments: parsedAttachments,
            },
          ],
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create chat");
      }
      return await response.json();
    },
    onMutate: async (data) => {
      setMessages([
        {
          id: "1",
          content: data.input,
          role: "user",
          experimental_attachments: await convertFilesToAttachments(
            data.attachments,
          ),
        },
      ]);
    },
    onSuccess: (data) => {
      router.push(
        ROUTE_TRADEMARK_ASSISTANT_CHAT({
          teamId: Number(teamId),
          chatId: data.chatId,
        }),
      );
      router.refresh();
    },
  });

  const onSubmit = (
    e: { preventDefault?: () => void } | undefined,
    options?: { experimental_attachments?: FileList },
  ) => {
    e?.preventDefault?.();
    posthogCapture("chat_created", {
      message: input,
      attachments: Array.from(options?.experimental_attachments ?? []).map(
        (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }),
      ),
    });
    createChat({
      input,
      attachments: options?.experimental_attachments ?? new FileList(),
    });
    setInput("");
  };

  const onSuggestionClick = (userMessage: {
    content: string;
    role: "user";
  }) => {
    posthogCapture("chat_suggestion_clicked", {
      content: userMessage.content,
    });
    createChat({
      input: userMessage.content,
    });
    setInput("");
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
      handleInputChange={(e) => setInput(e.target.value)}
      isGenerating={isPending}
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
