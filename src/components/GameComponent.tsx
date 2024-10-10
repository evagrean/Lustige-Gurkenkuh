"use client";

import React, { useState } from "react";
import { generateWord, generateAnimalExpression, getImageUrl } from "../utils/openaiController";
import { errorMessageAnimalExpression, imgMessage, missingAdjectiveMessage, missingVegetableMessage, missingWordsMessage } from "../utils/messages";
import { Londrina_Sketch } from "next/font/google";
import styles from "./GameComponent.module.css";

// Header
const londrinaSketch = Londrina_Sketch({ subsets: ["latin"], weight: ["400"] });

export default function GameComponent() {
  const [adjective, setAdjective] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [animal, setAnimal] = useState("");
  const [funnyAnimal, setFunnyAnimal] = useState("");
  const [missingMessage, setMissingMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgErrorMessage, setImgErrorMessage] = useState("");

  const resetGame = () => {
    setAdjective("");
    setVegetable("");
    setAnimal("");
    setFunnyAnimal("");
    setMissingMessage("");
    setImageUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateWord = async (type: string) => {
    const word = await generateWord(type);
    switch (type) {
      case "adjective":
        if (word) setAdjective(word);
        if (animal && vegetable) handleGenerateFunnyAnimal(adjective, vegetable, word);
        break;
      case "vegetable":
        if (word) setVegetable(word);
        if (animal && adjective) handleGenerateFunnyAnimal(adjective, vegetable, animal);
        break;
      case "animal":
        if (word) {
          setAnimal(word);
        }
        if (adjective && vegetable) {
          handleGenerateFunnyAnimal(adjective, vegetable, word);
        } else if (!adjective) {
          setMissingMessage(missingAdjectiveMessage);
        } else if (!vegetable) {
          setMissingMessage(missingVegetableMessage);
        } else if (!adjective && !vegetable) {
          setMissingMessage(missingWordsMessage);
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

        setMissingMessage(errorMessageAnimalExpression);
      }
    } else {
      console.error("Cannot generate funny animal: missing adjective, vegetable, or animal");
      setMissingMessage(errorMessageAnimalExpression);
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
    <div>
      <header className={`${styles.header} ${londrinaSketch.className}`}>
        <h1 className={styles.headerTitle}>Die Lustige Gurkenkuh</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonRow}>
            <div className={styles.wordContainer}>
              {!adjective ? (
                <button className={`${styles.button} ${styles.jarButton} ${styles.adjectiveButton}`} onClick={() => handleGenerateWord("adjective")}>
                  Ziehe ein Adjektiv
                </button>
              ) : (
                <span className={styles.generatedWord}>{adjective}</span>
              )}
            </div>
            <div className={styles.wordContainer}>
              {!vegetable ? (
                <button className={`${styles.button} ${styles.jarButton} ${styles.vegetableButton}`} onClick={() => handleGenerateWord("vegetable")}>
                  Ziehe eine Frucht
                </button>
              ) : (
                <span className={styles.generatedWord}>{vegetable}</span>
              )}
            </div>

            <div className={styles.wordContainer}>
              {!animal ? (
                <button className={`${styles.button} ${styles.jarButton} ${styles.animalButton}`} onClick={() => handleGenerateWord("animal")}>
                  Ziehe ein Tier
                </button>
              ) : (
                <span className={styles.generatedWord}>{animal}</span>
              )}
            </div>
          </div>
        </div>

        {!missingMessage && funnyAnimal ? (
          <div>
            {!imageUrl && !isLoading && (
              <button className={`${styles.button} ${styles.drawButton}`} onClick={handleGenerateImage}>
                Male: {funnyAnimal}
              </button>
            )}
          </div>
        ) : (
          <div className={styles.missingMessage}>{missingMessage}</div>
        )}
        {isLoading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {imgErrorMessage && <div className={styles.imgErrorMessage}>{imgErrorMessage}</div>}

        {imageUrl && (
          <div className={styles.imageContainer}>
            <img className={styles.image} src={imageUrl} alt={funnyAnimal} />
          </div>
        )}
        {imageUrl && (
          <div className={styles.resetButtonContainer}>
            <button className={`${styles.button} ${styles.resetButton}`} onClick={resetGame}>
              Nochmal Spielen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
