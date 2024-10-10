import openai from "./openaiConfig";
import { wordPrompt, funnyAnimalPrompt, imagePrompt } from "./prompts";

const generateWord = async (term: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: wordPrompt(term),
        },
      ],
    });

    const word = response.choices[0].message.content;
    if (!word) {
      throw new Error("No word generated");
    }
    return word;
  } catch (err) {
    console.error("Error generating word:", err);
    throw err;
  }
};

const generateAnimalExpression = async (adjective: string, vegetable: string, animal: string): Promise<string | null> => {
  // we return null if the API call fails or if no text is generated
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: funnyAnimalPrompt(adjective, vegetable, animal),
        },
      ],
    });
    console.dir(response, { depth: null });
    const newAnimal: string | null = response.choices[0].message.content;

    if (!newAnimal) {
      throw new Error("No animal generated");
    }

    return newAnimal;
  } catch (err) {
    console.error("Error generating animal:", err);
    throw err;
  }
};

const translate = async (expression: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Translate ${expression} into English. Return only one word or possible translation.`,
        },
      ],
    });
    const translation = response.choices[0].message.content;
    console.log(translation);
    if (!translation) {
      throw new Error("No translation for expression");
    }
    return translation;
  } catch (err) {
    console.error("Error translating funny animal", err);
    throw err;
  }
};

const getImageUrl = async (funnyAnimal: string, adjective: string, vegetable: string, animal: string): Promise<string> => {
  try {
    // let funnyAnimalTranslation: string;
    let adjectiveTranslation: string;
    let vegetableTranslation: string;
    let animalTranslation: string;
    try {
      //  funnyAnimalTranslation = await translate(funnyAnimal);
      adjectiveTranslation = await translate(adjective);
      vegetableTranslation = await translate(vegetable);
      animalTranslation = await translate(animal);
    } catch (err) {
      console.error("Error getting translated words:", err);
      throw err; // throw error to be handled by the caller
    }
    if (!adjectiveTranslation || !vegetableTranslation || !animalTranslation) {
      throw new Error("No translation for expression");
    }
    const response = await openai.images.generate({
      prompt: imagePrompt(adjectiveTranslation, vegetableTranslation, animalTranslation),
      n: 1,
      size: "512x512",
      quality: "hd",
    });
    console.log(response.data[0].revised_prompt);

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error("No image URL generated");
    }
    return imageUrl;
  } catch (err) {
    console.error("Error generating image:", err);
    throw err;
  }
};

export { generateWord, generateAnimalExpression, getImageUrl };
