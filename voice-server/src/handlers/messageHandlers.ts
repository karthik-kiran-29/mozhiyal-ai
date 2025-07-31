import { createWriteStream, unlink } from "fs";
import { frame } from "../frame/frame.js";
import { Session } from "../types.js";

export async function handleMessage(message:Buffer, session:Session) {
  try {
    console.time("timer");

    const parsed = JSON.parse(message.toString());
    const { type, data } = parsed;

    if (type === "base64-wav" && typeof data === "string") {
      const wavBuffer = Buffer.from(data, "base64");
      const wavFilePath = `./audio/recording-${session.sessionId}-${Date.now()}.wav`;

      await new Promise<void>((resolve, reject) => {
        const writeStream = createWriteStream(wavFilePath);
        writeStream.write(wavBuffer);
        writeStream.end();
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      // Process audio and update session conversations
      const result = await frame("voice", wavFilePath, session.conversations);
      session.conversations = result.conversations;

      //delete the file
      unlink(wavFilePath,(err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }
        console.log(`File ${wavFilePath} has been successfully removed.`);
        })
      

      session.ws.send(JSON.stringify({ type: "audio", data: result.response }));
      console.log(`Processed WAV for session ${session.sessionId}`);
      console.timeEnd("timer");
    } else {
      console.warn("Unsupported message type or invalid format");
    }
  } catch (err) {
    console.error("Error handling message:", err);
  }
}