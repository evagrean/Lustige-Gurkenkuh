const promptHelper = `My prompt has full detail so no need to add any more details:`;

const wordPrompt = (term: string) => {
  let promptPart;
  if (term === "adjective") {
    promptPart = `The adjective should be common and consist of only one part, 
without compound words made of two or more adjectives. It must be a positive adjective and a real word`;
  } else if (term === "vegetable") {
    promptPart = `Return the name of a vegetable or fruit. The returned word must not be "Karotte"`;
  } else if (term === "animal") {
    promptPart = `Return the name of an animal. Do not return the German word for "animal". Return a real animal.`;
  }

  const prompt = `Generate a German word based on the given term ${term} and return only the word. ${promptPart}. 
Generate a new word each time. Give back a German word.`;
  return prompt;
};

const funnyAnimalPrompt = (adjective: string, vegetable: string, animal: string) => {
  const prompt = `Generate a German expression. Form a compound word from the vegetable ${vegetable} and the animal ${animal}.
${vegetable} should be the first part (determinant) and ${animal} the second part (base word).
Then place the adjective ${adjective} in front. Adjust ${adjective} so that it matches 
the gender of the base word ${animal} grammatically.
Add the appropriate indefinite article as well.
Now, return the complete combination of article, adjective, and compound word in German.`;
  return prompt;
};

const imagePrompt = (adjective: string, vegetable: string, animal: string) => {
  const prompt = `${promptHelper} Generate an image of an ${animal}. The ${animal} has the same color as a ${vegetable}. 
    The fur or skin of the ${animal} has a similar texture or pattern to a ${vegetable}. 
    The ${animal} should have a similar shape or form to a ${vegetable}. 
    The ${animal} has to be ${adjective}.
    The image must not contain any text, fonts or letters.`;
  console.log(prompt);
  return prompt;
};

export { wordPrompt, funnyAnimalPrompt, imagePrompt };
