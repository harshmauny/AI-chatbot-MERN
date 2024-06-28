import { CohereClient } from "cohere-ai";

export function CohereConfig() {
  const config = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });
  return config;
}
