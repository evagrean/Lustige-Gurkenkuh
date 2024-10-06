import openai from "./openaiConfig";

const generateWord = async (term: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Generiere mir ein deutsches Wort basierend auf dem vorgegebenen Begriff ${term} und gebe mir nur das Wort zurück.
        Es gibt die Möglichkeit Adjectiv bzw. "adjective", Gemüse, bzw. "vegetable" oder Tier, bzw. "animal". Wenn der vorgegebene Begriff "adjective" ist,
        dann generiere ein Adjektiv. Das Adjektiv soll relativ gänging sein und nur aus einem Teil bestehen. Keine zusammengesetzten Wörter aus zwei oder mehr Adjektiven. Wenn der Begriff "vetetable" ist, dann gib
        den Namen eines Gemüses oder Obstes zurück. Das Wort darf nicht "Karotte" sein. Wenn der Begriff "animal" ist, dann gib den Namen eines Tieres zurück.
        Generiere jedes Mal ein neues Wort`,
      },
    ],
  });
  const word = response.choices[0].message.content;

  return word;
};

const generateAnimal = async (adjective: string, vegetable: string, animal: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Bilde aus dem Gemüse ${vegetable} und dem Tier ${animal} ein zusammengesetztes Wort, ein Kompositum. 
    Dabei ist ${vegetable} das Erstglied bzw. Bestimmungswort und ${animal} das Zweitglied bzw. Grundwort.
    Setze dann das Adjektiv ${adjective} davor. Passe ${adjective} so an, dass es grammatikalisch zum Geschlecht 
    des Grundwortes ${animal} passt. Setze noch den passenden unbestimmten Artikel davor.
    Gebe mir nun die fertige Kombination aus Artikel, Adjektiv und Kompositum zurück.`,
      },
    ],
  });
  const newAnimal = response.choices[0].message.content;
  return newAnimal;
};

const getImageUrl = async (funnyAnimal: string, adjective: string, vegetable: string, animal: string) => {
  const response = await openai.images.generate({
    prompt: `Generiere ein Bild von: ${funnyAnimal}. Das ist ein/eine ${animal}, das aus einer/einem ${vegetable} besteht
    und ${adjective} aussieht. Das Fell oder die Haut soll die gleiche Farbe haben wie ein/eine ${vegetable}. Es soll aber 
    schon das ${animal} erkennbar sein. Auf dem Bild soll kein Text und keine Schrift zu sehen sein.`,
    n: 1,
    size: "512x512",
  });
  const imageUrl = response.data[0].url;
  console.log(imageUrl);
  return imageUrl;
};
export { generateWord, generateAnimal, getImageUrl };
