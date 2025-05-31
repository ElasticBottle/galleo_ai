"use client";

import { ArrowUp, Info, Loader2, Mic, Paperclip, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useAudioRecording } from "../../hooks/use-audio-recording";
import { useAutosizeTextArea } from "../../hooks/use-autosize-textarea";
import { cn } from "../../utils/cn";
import { PaperClip } from "../icon";
import { Button } from "../ui/button";
import { AudioVisualizer } from "./audio-visualizer";
import { FilePreview } from "./file-preview";
import { InterruptPrompt } from "./interrupt-prompt";

interface MessageInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  submitOnEnter?: boolean;
  stop?: () => void;
  isGenerating: boolean;
  enableInterrupt?: boolean;
  transcribeAudio?: ((blob: Blob) => Promise<string>) | undefined;
  attachments?: {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  };
}

export function ChatMessageInput({
  className,
  placeholder = "Ask AI...",
  stop,
  isGenerating,
  attachments,
  transcribeAudio,
  submitOnEnter = true,
  enableInterrupt = true,
  onKeyDown: onKeyDownProp,
  ...props
}: MessageInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showInterruptPrompt, setShowInterruptPrompt] = useState(false);

  const {
    isListening,
    isSpeechSupported,
    isRecording,
    isTranscribing,
    audioStream,
    toggleListening,
    stopRecording,
  } = useAudioRecording({
    transcribeAudio,
    onTranscriptionComplete: (text) => {
      props.onChange?.({
        target: { value: text },
      } as unknown as ChangeEvent<HTMLTextAreaElement>);
    },
  });

  useEffect(() => {
    if (!isGenerating) {
      setShowInterruptPrompt(false);
    }
  }, [isGenerating]);

  const addFiles = (files: File[] | null) => {
    if (!attachments || !files) {
      return;
    }
    attachments.setFiles((currentFiles) => {
      if (currentFiles.length === 0) {
        return files;
      }
      if (files.length === 0) {
        return currentFiles;
      }
      return [...currentFiles, ...files];
    });
  };

  const onDragOver = (event: React.DragEvent) => {
    if (!attachments) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent) => {
    if (!attachments) return;
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent) => {
    if (!attachments) return;
    event.preventDefault();
    setIsDragging(false);
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files.length) {
      addFiles(Array.from(dataTransfer.files));
    }
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const text = event.clipboardData.getData("text");
    if (text && text.length > 500 && attachments) {
      event.preventDefault();
      const blob = new Blob([text], { type: "text/plain" });
      const file = new File([blob], "Pasted text", {
        type: "text/plain",
        lastModified: Date.now(),
      });
      addFiles([file]);
      return;
    }

    const files = Array.from(items)
      .map((item) => item.getAsFile())
      .filter((file) => file !== null);
    addFiles(files);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (isGenerating && stop && enableInterrupt) {
        if (showInterruptPrompt) {
          stop();
          setShowInterruptPrompt(false);
          event.currentTarget.form?.requestSubmit();
        } else if (
          props.value ||
          (attachments && attachments.files.length > 0)
        ) {
          setShowInterruptPrompt(true);
          return;
        }
      }

      event.currentTarget.form?.requestSubmit();
    }

    onKeyDownProp?.(event);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Update text area height when value changes
  useEffect(() => {
    if (textAreaRef.current) {
      setTextAreaHeight(textAreaRef.current.offsetHeight);
    }
  }, [props.value]);

  const showFileList = attachments && attachments.files.length > 0;
  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value, showFileList],
  });

  return (
    <div
      className="relative flex w-full"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {enableInterrupt && (
        <InterruptPrompt
          isOpen={showInterruptPrompt}
          close={() => setShowInterruptPrompt(false)}
        />
      )}

      <RecordingPrompt
        isVisible={isRecording}
        onStopRecording={stopRecording}
      />

      <div className="relative flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <textarea
            aria-label="Write your prompt here"
            placeholder={placeholder}
            ref={textAreaRef}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
            className={cn(
              "z-10 w-full grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-sm ring-offset-background transition-shadow placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              showFileList && "pb-16",
              className,
            )}
            {...props}
          />

          {attachments && (
            <div className="absolute inset-x-3 bottom-0 z-20 overflow-x-auto py-3">
              <div className="flex space-x-3">
                <AnimatePresence mode="popLayout">
                  {attachments.files.map((file) => {
                    return (
                      <FilePreview
                        key={file.name + String(file.lastModified)}
                        file={file}
                        onRemove={() => {
                          attachments.setFiles((files) => {
                            if (files.length === 0) return [];
                            return Array.from(files).filter((f) => f !== file);
                          });
                        }}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex gap-2">
        {attachments && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label="Attach a file"
            onClick={async () => {
              const files = await showFileUploadDialog();
              addFiles(files);
            }}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        )}
        {isSpeechSupported && (
          <Button
            type="button"
            variant="outline"
            className={cn("h-8 w-8", isListening && "text-primary")}
            aria-label="Voice input"
            size="icon"
            onClick={toggleListening}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
        {isGenerating && stop ? (
          <Button
            type="button"
            size="icon"
            className="h-8 w-8"
            aria-label="Stop generating"
            onClick={stop}
          >
            <Square className="h-3 w-3 animate-pulse" fill="currentColor" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 transition-opacity"
            aria-label="Send message"
            disabled={props.value === "" || isGenerating}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>

      {attachments && <FileUploadOverlay isDragging={isDragging} />}

      <RecordingControls
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        audioStream={audioStream}
        textAreaHeight={textAreaHeight}
        onStopRecording={stopRecording}
      />
    </div>
  );
}
ChatMessageInput.displayName = "MessageInput";

function showFileUploadDialog() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.accept = "*/*";
  input.click();

  return new Promise<File[] | null>((resolve) => {
    input.onchange = (e) => {
      const files = (e.currentTarget as HTMLInputElement).files;

      if (files) {
        resolve(Array.from(files));
        return;
      }

      resolve([]);
    };
  });
}

function FileUploadOverlay({
  isDragging,
}: {
  isDragging: boolean;
}) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center space-x-2 rounded-xl border border-border border-dashed bg-background text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <PaperClip className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TranscribingOverlay() {
  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <motion.div
          className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-primary/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>
      <p className="mt-4 font-medium text-muted-foreground text-sm">
        Transcribing audio...
      </p>
    </motion.div>
  );
}

function RecordingPrompt({
  isVisible,
  onStopRecording,
}: {
  isVisible: boolean;
  onStopRecording: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ top: 0, filter: "blur(5px)" }}
          animate={{
            top: -40,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              filter: { type: "tween" },
            },
          }}
          exit={{ top: 0, filter: "blur(5px)" }}
          className="-translate-x-1/2 absolute left-1/2 flex cursor-pointer overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-muted-foreground text-sm"
          onClick={onStopRecording}
        >
          <span className="mx-2.5 flex items-center">
            <Info className="mr-2 h-3 w-3" />
            Click to finish recording
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RecordingControls({
  isRecording,
  isTranscribing,
  audioStream,
  textAreaHeight,
  onStopRecording,
}: {
  isRecording: boolean;
  isTranscribing: boolean;
  audioStream: MediaStream | null;
  textAreaHeight: number;
  onStopRecording: () => void;
}) {
  if (isRecording) {
    return (
      <div
        className="absolute inset-[1px] z-50 overflow-hidden rounded-xl"
        style={{ height: textAreaHeight - 2 }}
      >
        <AudioVisualizer
          stream={audioStream}
          isRecording={isRecording}
          onClick={onStopRecording}
        />
      </div>
    );
  }

  if (isTranscribing) {
    return (
      <div
        className="absolute inset-[1px] z-50 overflow-hidden rounded-xl"
        style={{ height: textAreaHeight - 2 }}
      >
        <TranscribingOverlay />
      </div>
    );
  }

  return null;
}
