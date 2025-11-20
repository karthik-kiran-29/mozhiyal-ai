"use client"

import { useEffect, useRef, useState } from "react";

// Add type declaration for window.vad
declare global {
    interface Window {
        vad: any;
    }
}

interface VoiceChatProps {
    Idle: string;
    Speaking: string;
    Processing: string;
}

export default function VoiceChat({ Idle, Speaking, Processing }: {
    Idle: string;
    Speaking: string;
    Processing: string;
}) {
    const [status, setStatus] = useState<"Idle" | "Speaking" | "Processing">("Idle");
    const ws = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioQueue = useRef<string[]>([]);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    // GIFs for each status
    const statusGifs: Record<typeof status, string> = {
        Idle: Idle,
        Speaking: Speaking,
        Processing: Processing,
    };

    useEffect(() => {
        const loadScripts = async () => {
            await loadScript("https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js");
            await loadScript("https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.22/dist/bundle.min.js");
            setup();
        };

        const setup = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            ws.current = new WebSocket("ws://localhost:8080");
            ws.current.onopen = () => console.log("Connected to WebSocket");
            ws.current.onmessage = (message) => {
                const parsed = JSON.parse(message.data);
                if (parsed.type === "audio" && parsed.data) {
                    parsed.data.forEach((base64Audio: string) => {
                        audioQueue.current.push(base64Audio);
                    });
                    playNextAudio();
                }
            };

            const myvad = await window.vad.MicVAD.new({
                stream,
                onSpeechStart: () => {
                    setStatus("Speaking");
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }
                    audioQueue.current = [];
                    startRecording();
                },
                onSpeechEnd: () => {
                    setStatus("Processing");
                    stopRecording();
                },
            });

            myvad.start();
        };

        loadScripts();
        // Cleanup on unmount
        return () => {
            ws.current?.close();
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        };
        // eslint-disable-next-line
    }, []);

    const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.body.appendChild(script);
        });
    };

    const startRecording = () => {
        if (!mediaStreamRef.current) return;

        const options = { mimeType: "audio/webm; codecs=opus" };
        const recorder = new MediaRecorder(mediaStreamRef.current, options);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = async (e) => {
            const blob = new Blob([e.data], { type: "audio/webm" });
            const arrayBuffer = await blob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const wavBuffer = encodeWAV(audioBuffer);
            const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1];
                if (base64String && ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: "base64-wav", data: base64String }));
                }
            };
            reader.readAsDataURL(wavBlob);
        };

        recorder.onstop = () => {
            // Don't set status to Idle here, wait for agent audio to finish
        };

        recorder.start();
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    const encodeWAV = (audioBuffer: AudioBuffer): ArrayBuffer => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const numSamples = audioBuffer.length;
        const bitsPerSample = 16;

        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = numSamples * blockAlign;

        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + dataSize, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(view, 36, "data");
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                let sample = audioBuffer.getChannelData(channel)[i];
                sample = Math.max(-1, Math.min(1, sample));
                const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                view.setInt16(offset, intSample, true);
                offset += 2;
            }
        }

        return buffer;
    };

    const writeString = (view: DataView, offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    // Play agent audio, set status to Idle after last audio finishes
    const playNextAudio = () => {
        if (audioQueue.current.length === 0 || audioRef.current?.paused === false) return;

        const base64 = audioQueue.current.shift();
        if (!base64) {
            setStatus("Idle");
            return;
        }

        const audioBlob = base64ToBlob(base64, "audio/wav");
        const url = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().then(() => {
                audioRef.current!.onended = () => {
                    if (audioQueue.current.length > 0) {
                        playNextAudio();
                    } else {
                        setStatus("Idle");
                    }
                    URL.revokeObjectURL(url);
                };
            });
        }
    };

    const base64ToBlob = (base64: string, type: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    };

    return (
        <>
            <div
                className="flex justify-center items-end-safe` min-h-screen md:min-h-auto"
            >
                <img
                    src={statusGifs[status]}
                    alt={status}
                    className="w-full max-w-xs md:max-w-md lg:max-w-lg justify-center absolute   z-10"
                />
            </div>
            <audio ref={audioRef} className="hidden" />
        </>
    );
}
