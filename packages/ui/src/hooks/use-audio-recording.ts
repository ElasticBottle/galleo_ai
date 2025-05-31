import { useEffect, useRef, useState } from "react";
import { audioController } from "../utils/audio";

interface UseAudioRecordingOptions {
  transcribeAudio?: ((blob: Blob) => Promise<string>) | undefined;
  onTranscriptionComplete?: (text: string) => void;
}

export function useAudioRecording({
  transcribeAudio,
  onTranscriptionComplete,
}: UseAudioRecordingOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(!!transcribeAudio);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const activeRecordingRef = useRef<Blob | null>(null);

  useEffect(() => {
    const checkSpeechSupport = () => {
      const hasMediaDevices = !!navigator.mediaDevices?.getUserMedia;
      setIsSpeechSupported(hasMediaDevices && !!transcribeAudio);
    };

    checkSpeechSupport();
  }, [transcribeAudio]);

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      // First stop the recording to get the final blob
      audioController.stop();
      // Wait for the recording promise to resolve with the final blob
      const recording = await activeRecordingRef.current;
      if (transcribeAudio && recording) {
        const text = await transcribeAudio(recording);
        onTranscriptionComplete?.(text);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsTranscribing(false);
      setIsListening(false);
      if (audioStream) {
        for (const track of audioStream.getTracks()) {
          track.stop();
        }
        setAudioStream(null);
      }
      activeRecordingRef.current = null;
    }
  };

  const toggleListening = async () => {
    if (!isListening) {
      try {
        setIsListening(true);
        setIsRecording(true);
        // Get audio stream first
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);

        // Start recording with the stream
        activeRecordingRef.current = await audioController.start(stream);
      } catch (error) {
        console.error("Error recording audio:", error);
        setIsListening(false);
        setIsRecording(false);
        if (audioStream) {
          for (const track of audioStream.getTracks()) {
            track.stop();
          }
          setAudioStream(null);
        }
      }
    } else {
      await stopRecording();
    }
  };

  return {
    isListening,
    isSpeechSupported,
    isRecording,
    isTranscribing,
    audioStream,
    toggleListening,
    stopRecording,
  };
}
