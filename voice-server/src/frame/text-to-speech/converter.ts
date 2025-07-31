import { SarvamAIConfig } from "../../config/SarvamAIConfig";

export async function convertTextToSpeech(text: string ):Promise<string[]> {
    const client = SarvamAIConfig();
    const response = await client.textToSpeech.convert({
        text: text,
        target_language_code: "ta-IN",
        enable_preprocessing: true,
        model: "bulbul:v2",
        speaker: "anushka"
    });

    return response.audios;
}