import { SarvamAIClient } from "sarvamai";
import fs from "fs";
import { SarvamAIConfig } from "../../config/SarvamAIConfig";
import { File } from 'node:buffer'
 

export async function TranscriberSarvam(File_path: string): Promise<string> {
    const client = SarvamAIConfig();

    const buffer = fs.readFileSync(File_path);
    const file = new File([buffer], File_path.split("/").pop() || "audio", { type: "audio/wav" });

    const response = await client.speechToText.transcribe(file, {
        model: "saarika:v2"
    });

    return response.transcript;
}





