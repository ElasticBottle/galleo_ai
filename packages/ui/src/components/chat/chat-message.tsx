"use client";
import type { Message as AIMessage } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { type VariantProps, cva } from "class-variance-authority";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Ban, Check, ChevronRight, Dot, Terminal } from "../icon";
import { Badge } from "../ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { FilePreview } from "./file-preview";
import MarkdownRenderer from "./markdown-renderer";

const chatBubbleVariants = cva(
  "group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]",
  {
    variants: {
      isUser: {
        true: "bg-primary text-primary-foreground",
        false: "bg-muted text-foreground",
      },
      animation: {
        none: "",
        slide: "fade-in-0 animate-in duration-300",
        scale: "fade-in-0 zoom-in-75 animate-in duration-300",
        fade: "fade-in-0 animate-in duration-500",
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: "slide",
        class: "slide-in-from-right",
      },
      {
        isUser: false,
        animation: "slide",
        class: "slide-in-from-left",
      },
      {
        isUser: true,
        animation: "scale",
        class: "origin-bottom-right",
      },
      {
        isUser: false,
        animation: "scale",
        class: "origin-bottom-left",
      },
    ],
  },
);
type Animation = VariantProps<typeof chatBubbleVariants>["animation"];

function dataUrlToUint8Array(data: string) {
  const parts = data.split(",");
  if (parts.length < 2 || !parts[1]) {
    console.warn("Invalid data URL format provided to dataUrlToUint8Array");
    return new Uint8Array();
  }
  const base64 = parts[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const buf = bytes;
  return buf;
}

export type Message = AIMessage;
export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
}

export const ChatMessage = ({
  role,
  content,
  animation = "scale",
  actions,
  experimental_attachments,
  createdAt,
  showTimeStamp = false,
  parts,
}: ChatMessageProps) => {
  const { data: files } = useQuery({
    queryKey: ["chat-message", experimental_attachments],
    queryFn: async () => {
      const filePromises = experimental_attachments?.map(async (attachment) => {
        if (attachment.url.startsWith("data:")) {
          const dataArray = dataUrlToUint8Array(attachment.url);
          const file = new File([dataArray], attachment.name ?? "Unknown", {
            type: attachment.contentType ?? "application/octet-stream",
          });
          return file;
        }
        if (attachment.url.startsWith("http")) {
          console.log("attachment.url", attachment.url);
          const response = await fetch(attachment.url);
          const blob = await response.blob();
          const file = new File([blob], attachment.name ?? "Unknown", {
            type: blob.type,
          });
          return file;
        }
        return null;
      });
      if (!filePromises) {
        return [];
      }
      const rawFiles = await Promise.all(filePromises);
      return rawFiles.filter((file) => file !== null);
    },
  });

  const isUser = role === "user";
  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div
        className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
      >
        {files ? (
          <div className="mb-1 flex flex-wrap gap-2">
            {files.map((file, index) => {
              return <FilePreview file={file} key={`${file?.name}-${index}`} />;
            })}
          </div>
        ) : null}

        <div className={cn(chatBubbleVariants({ isUser, animation }))}>
          <MarkdownRenderer>{content}</MarkdownRenderer>
        </div>

        {showTimeStamp && createdAt ? (
          <time
            dateTime={createdAt.toISOString()}
            className={cn(
              "block px-1 pt-1 text-xs opacity-50",
              animation !== "none" && "fade-in-0 animate-in duration-500",
            )}
          >
            {formattedTime}
          </time>
        ) : null}
      </div>
    );
  }

  if (parts && parts.length > 0) {
    return parts.map((part, index) => {
      if (part.type === "text") {
        return (
          <div
            className={cn(
              "flex flex-col",
              isUser ? "items-end" : "items-start",
            )}
            key={`text-${part.text}-${index}`}
          >
            <div
              className={cn(chatBubbleVariants({ isUser, animation: "none" }))}
            >
              <MarkdownRenderer>
                {/* We are not rendering code since this is lawyer facing so removing backticks where google might have added them is okay */}
                {part.text.replace(/```markdown/g, "").replace(/```/g, "")}
              </MarkdownRenderer>
              {actions ? (
                <div className="-bottom-4 absolute right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
                  {actions}
                </div>
              ) : null}
            </div>

            {showTimeStamp && createdAt ? (
              <time
                dateTime={createdAt.toISOString()}
                className={cn(
                  "block px-1 pt-1 text-xs opacity-50",
                  animation !== "none" && "fade-in-0 animate-in duration-500",
                )}
              >
                {formattedTime}
              </time>
            ) : null}
          </div>
        );
      }
      if (part.type === "reasoning") {
        return (
          <ReasoningBlock
            key={`reasoning-${part.reasoning}-${index}`}
            part={part}
          />
        );
      }

      if (part.type === "tool-invocation") {
        return (
          <div className="sm:max-w-[70%]">
            <ToolCall
              key={`tool-${part.toolInvocation.toolName}-${index}`}
              part={part}
            />
          </div>
        );
      }
      return null;
    });
  }

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div className={cn(chatBubbleVariants({ isUser, animation }))}>
        <MarkdownRenderer>{content}</MarkdownRenderer>
        {actions ? (
          <div className="-bottom-4 absolute right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
            {actions}
          </div>
        ) : null}
      </div>

      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            "mt-1 block px-1 text-xs opacity-50",
            animation !== "none" && "fade-in-0 animate-in duration-500",
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};

const ReasoningBlock = ({
  part,
}: {
  part: Extract<
    NonNullable<Pick<ChatMessageProps, "parts">["parts"]>[number],
    { type: "reasoning" }
  >;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2 flex flex-col items-start sm:max-w-[70%]">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group w-full overflow-hidden rounded-lg border bg-muted/50"
      >
        <div className="flex items-center p-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
              <span>Thinking</span>
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent forceMount>
          <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { height: "auto", opacity: 1 },
              closed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="border-t"
          >
            <div className="p-2">
              <div className="whitespace-pre-wrap text-xs">
                {part.reasoning}
              </div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const mapToolNameToLabel: Record<string, string> = {
  backgroundResearch: "Background Research",
  niceClassification: "Nice Classification checks",
  relevantGoodsServices: "Relevant Goods and Services analysis",
  markFilingRecommendation: "Mark Filing Recommendation",
};

function ToolCall({
  part: { toolInvocation },
}: {
  part: Extract<
    NonNullable<Pick<ChatMessageProps, "parts">["parts"]>[number],
    { type: "tool-invocation" }
  >;
}) {
  const isCancelled =
    toolInvocation.state === "result" &&
    toolInvocation.result?.__cancelled === true;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-muted-foreground text-sm">
        <Ban className="h-4 w-4" />
        <span>Cancelled {toolInvocation.toolName}</span>
      </div>
    );
  }

  switch (toolInvocation.state) {
    case "partial-call":
    case "call":
      return (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-muted-foreground text-sm">
          <Terminal className="h-4 w-4" />
          Performing{" "}
          {mapToolNameToLabel[toolInvocation.toolName] ??
            toolInvocation.toolName}{" "}
          <div className="-gap-2.5 flex h-full items-end">
            <Dot className="size-3 animate-typing-dot-bounce" />
            <Dot className="size-3 animate-typing-dot-bounce [animation-delay:90ms]" />
            <Dot className="size-3 animate-typing-dot-bounce [animation-delay:180ms]" />
          </div>
        </div>
      );
    case "result":
      return (
        <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Check className="h-4 w-4" />
            Finished{" "}
            {mapToolNameToLabel[toolInvocation.toolName] ??
              toolInvocation.toolName}
          </div>
          {toolInvocation.toolName === "backgroundResearch" && (
            <div className="flex gap-1 overflow-x-auto">
              <div className="text-muted-foreground text-xs">Sources</div>
              <div className="flex gap-1">
                {toolInvocation.result?.sources?.map(
                  (source: {
                    web: {
                      title: string;
                      uri: string;
                    };
                  }) => (
                    <Badge key={source.web.uri} variant="outline">
                      <a
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.web.title}
                      </a>
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}
          {/* don't show results yet */}
          {/* <pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
            {JSON.stringify(toolInvocation.result, null, 2)}
          </pre> */}
        </div>
      );
    default:
      return null;
  }
}
