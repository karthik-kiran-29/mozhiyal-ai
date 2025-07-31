import { TranscriberSarvam } from "../frame/speech-to-text/transcipter";
import { convertTextToSpeech } from "../frame/text-to-speech/converter";
import { chatWithSarvamAI } from "../frame/text-to-text/chat";
import { conversation } from "../types";

export async function frame(
  type: "chat" | "voice",
  File_path: string,
  conversations: conversation[]
): Promise<{ response: string[] | null; conversations: conversation[] }> {
  try {
    // Step 1: Transcribe audio to text
    console.log("Transcribing audio to text using Sarvam STT");
    const transcript = await TranscriberSarvam(File_path);

    // Step 2: Chat with Sarvam AI
    console.log("Chatting with Sarvam AI");
    const responsetxt = await chatWithSarvamAI(transcript, conversations);

    // Update conversations with response
    conversations = conversations.concat(responsetxt);

    // Step 3: Convert last response to speech
    const resultantText = responsetxt[responsetxt.length - 1].content;
    console.log("Converting text to speech using Sarvam TTS");
    console.log("conversation", resultantText);
    const response = await convertTextToSpeech(resultantText);

    return { response, conversations };
  } catch (error) {
    console.error("Error:", error);
    return { response: null, conversations };
  }
}
