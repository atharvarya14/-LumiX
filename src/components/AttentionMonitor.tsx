import { useEffect, useRef } from "react";

export default function AttentionMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    }

    startCamera();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", borderRadius: "12px" }}
      />
    </div>
  );
}
