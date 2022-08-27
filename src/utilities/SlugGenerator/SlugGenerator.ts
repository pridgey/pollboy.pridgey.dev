import { Adjectives } from "./Adjectives";
import { Nouns } from "./Nouns";

export const generateSlug = () => {
  const adj1 = Adjectives[Math.floor(Math.random() * Adjectives.length)];
  const adj2 = Adjectives[Math.floor(Math.random() * Adjectives.length)];
  const adj3 = Adjectives[Math.floor(Math.random() * Adjectives.length)];
  const noun = Nouns[Math.floor(Math.random() * Nouns.length)];

  return `${adj1}-${adj2}-${adj3}-${noun}`;
};
