import { Llm, LlmProvider } from '@uptiqai/integrations-sdk';
import prisma from '../client.ts';
import ApiError from '../utils/ApiError.ts';

const llm = new Llm({ provider: process.env.LLM_PROVIDER as LlmProvider });

export const sendMessage = async (userId: string, message: string) => {
  const prompt = `
    You are a supportive mental health assistant.
    The user said: "${message}"
    
    1. Detect the user's emotion from these categories: happy, sad, stress, anxiety, neutral.
    2. Provide a supportive, empathetic response.
    3. IMPORTANT: Do not provide medical advice or diagnosis. Always include a disclaimer if needed.
    
    Return the result in JSON format:
    {
      "sentiment": "detected_emotion",
      "content": "your_supportive_response"
    }
  `;

  try {
    const result = await llm.generateText({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.LLM_MODEL
    });

    const responseText = result.text;
    let parsedResponse;
    try {
      // Find JSON block if LLM returned extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsedResponse = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (e) {
      console.error("Failed to parse LLM response:", responseText);
      parsedResponse = {
        sentiment: 'neutral',
        content: responseText
      };
    }

    const disclaimer = " (Note: I am an AI assistant, not a doctor. Please consult a professional for medical help.)";
    const finalContent = parsedResponse.content + disclaimer;

    // Save user message
    await prisma.chat.create({
      data: {
        userId,
        content: message,
        role: 'user',
        sentiment: parsedResponse.sentiment
      }
    });

    // Save assistant response
    const assistantMessage = await prisma.chat.create({
      data: {
        userId,
        content: finalContent,
        role: 'assistant'
      }
    });

    return {
      id: assistantMessage.id,
      response: finalContent,
      sentiment: parsedResponse.sentiment,
      createdAt: assistantMessage.createdAt
    };
  } catch (error) {
    console.error("LLM Error:", error);
    throw new ApiError(500, "Failed to get response from AI");
  }
};

export const getMessages = async (userId: string) => {
  return await prisma.chat.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: 'asc' }
  });
};

export const clearHistory = async (userId: string) => {
  await prisma.chat.updateMany({
    where: { userId, isDeleted: false },
    data: { isDeleted: true }
  });
};
