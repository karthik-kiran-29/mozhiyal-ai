import { conversation } from "../../types";

export async function chatWithSarvamAI(userMessage:string,conversation:conversation[]): Promise<conversation[]> {
    conversation.push({
        role: 'user',
        content: userMessage
    })

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: conversation,
            model: 'sarvam-m',
            streams:true
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    conversation.push({
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || "No response from Sarvam AI"
    });
    console.log("Response from Sarvam AI:", data.choices?.[0]?.message?.content);

    const responseConversation:conversation[] = [{
        role: 'user',
        content: userMessage
    },{
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || "No response from Sarvam AI"
    }]
    return responseConversation;
}
