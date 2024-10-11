const errorMessageAnimalExpression = "Ups, dieses Tier ist so selten, dass es noch nie gesichtet wurde. Versuche es nochmal";

const missingWordsMessage = (missingWords: string[]) => {
  const message = `Jetzt fehlt noch: ${missingWords.join(", ")} `;
  return message;
};
const imgMessage = "Leider sind gerade alle meine Stifte abgebrochen. Versuche es nochmal, ich spitze während dessen meine Stifte";

export { errorMessageAnimalExpression, imgMessage, missingWordsMessage };
