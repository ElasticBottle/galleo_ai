export const audioController = (() => {
  let currentRecorder: MediaRecorder | null = null;
  return {
    start: (stream: MediaStream): Promise<Blob> => {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const audioChunks: Blob[] = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          resolve(audioBlob);
        };

        mediaRecorder.onerror = () => {
          reject(new Error("MediaRecorder error occurred"));
        };

        mediaRecorder.start(1000);
        currentRecorder = mediaRecorder;
      });
    },
    stop: () => {
      if (currentRecorder && currentRecorder.state !== "inactive") {
        currentRecorder.stop();
        currentRecorder = null;
      }
    },
  };
})();
