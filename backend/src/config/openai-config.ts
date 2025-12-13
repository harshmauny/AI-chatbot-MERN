import OpenAI from "openai";
import { appConfig } from "./env.js";

export function OpenAIConfig() {
  const openai = new OpenAI({
    apiKey: appConfig.openai.apiKey || process.env.OPENAI_API_KEY,
  });
  return openai;
}
