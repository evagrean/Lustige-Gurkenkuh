"use client";

import React, { useState } from "react";
import { generateWord, generateAnimalExpression, getImageUrl } from "../utils/openaiController";
import { errorMessageAnimalExpression, imgMessage } from "../utils/messages";
import styles from "./GameComponent.module.css";

export default function GameComponent() {
  const [adjective, setAdjective] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [animal, setAnimal] = useState("");
  const [funnyAnimal, setFunnyAnimal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgErrorMessage, setImgErrorMessage] = useState("");

  const resetGame = () => {
    setAdjective("");
    setVegetable("");
    setAnimal("");
    setFunnyAnimal("");
    setImageUrl("");
  };

  const handleGenerateWord = async (type: string) => {
    const word = await generateWord(type);
    switch (type) {
      case "adjective":
        if (word) setAdjective(word);

        break;
      case "vegetable":
        if (word) setVegetable(word);

        break;
      case "animal":
        if (word) {
          setAnimal(word);

          if (adjective && vegetable) {
            handleGenerateFunnyAnimal(adjective, vegetable, word);
          }
        }

        break;
    }
  };

  const handleGenerateFunnyAnimal = async (adjective: string, vegetable: string, animal: string) => {
    if (adjective && vegetable && animal) {
      try {
        const funnyAnimal = await generateAnimalExpression(adjective, vegetable, animal);
        if (funnyAnimal) setFunnyAnimal(funnyAnimal);
      } catch (err) {
        console.error("Error generating funny animal:", err);

        setFunnyAnimal(errorMessageAnimalExpression);
      }
    } else {
      console.error("Cannot generate funny animal: missing adjective, vegetable, or animal");
      setFunnyAnimal(errorMessageAnimalExpression);
    }
  };

  const handleGenerateImage = async () => {
    console.log("handleGenerateImage called");
    setIsLoading(true);

    try {
      // const url = "";
      // setImageUrl(url);
      const url = await getImageUrl(funnyAnimal, adjective, vegetable, animal);
      if (url) setImageUrl(url);
    } catch (err) {
      console.error("Error generating image:", err);
      // Handle error by showing a message and using a placeholder image
      setImgErrorMessage(imgMessage);
      setImageUrl("../../public/assets/placeholder.png");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Lustige Gurkenkuh</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.jarButton} ${styles.adjectiveButton}`} onClick={() => handleGenerateWord("adjective")} disabled={adjective !== ""}>
            Generate Adjective
          </button>
          {adjective && <span className={styles.generatedWord}>Generated adjective: {adjective}</span>}
        </div>

        {adjective && (
          <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${styles.jarButton} ${styles.vegetableButton}`} onClick={() => handleGenerateWord("vegetable")} disabled={vegetable !== ""}>
              Generate Vegetable
            </button>
            {vegetable && <span className={styles.generatedWord}>Generated vegetable: {vegetable}</span>}
          </div>
        )}

        {vegetable && (
          <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${styles.jarButton} ${styles.animalButton}`} onClick={() => handleGenerateWord("animal")} disabled={animal !== ""}>
              Generate Animal
            </button>
            {animal && <span className={styles.generatedWord}>Generated animal: {animal}</span>}
          </div>
        )}

        {animal && (
          <div>
            {!imageUrl && !isLoading && (
              <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleGenerateImage}>
                  Male: {funnyAnimal}
                </button>
              </div>
            )}
          </div>
        )}
        {isLoading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {imgErrorMessage && <div className={styles.imgErrorMessage}>{imgErrorMessage}</div>}

        {imageUrl && (
          <div>
            <img className={styles.image} src={imageUrl} alt="Ein Tier" />
          </div>
        )}

        <div className={styles.resetButtonContainer}>
          <button className={`${styles.button} ${styles.resetButton}`} onClick={resetGame}>
            Nochmal Spielen
          </button>
        </div>
      </div>
    </div>
  );
}
