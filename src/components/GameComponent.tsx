"use client";

import React, { useState, useEffect, useCallback } from "react";
import { generateWord, generateAnimalExpression, getImageUrl } from "../utils/openaiController";
import { errorMessageAnimalExpression, imgMessage, missingWordsMessage } from "../utils/messages";
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

  const checkWordsCompletion = useCallback(() => {
    if (adjective && vegetable && animal) {
      handleGenerateFunnyAnimal(adjective, vegetable, animal);
      setMissingMessage("");
    } else if (!adjective && !vegetable && !animal) {
      setMissingMessage("");
      setFunnyAnimal("");
    } else {
      const missing = [];
      if (!adjective) missing.push("Adjektiv");
      if (!vegetable) missing.push("Frucht");
      if (!animal) missing.push("Tier");
      setMissingMessage(missingWordsMessage(missing));
      setFunnyAnimal("");
    }
  }, [adjective, vegetable, animal]);

  useEffect(() => {
    checkWordsCompletion();
  }, [checkWordsCompletion]);

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

  const resetGame = () => {
    setAdjective("");
    setVegetable("");
    setAnimal("");
    setFunnyAnimal("");
    setMissingMessage("");
    setImageUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                <button className={`${styles.button} ${styles.jarButton}`} onClick={() => handleGenerateWord("adjective")} disabled={adjective !== ""}>
                  Ziehe ein Adjektiv
                </button>
              ) : (
                <span className={styles.generatedWord}>{adjective}</span>
              )}
            </div>
            <div className={styles.wordContainer}>
              {!vegetable ? (
                <button className={`${styles.button} ${styles.jarButton}`} onClick={() => handleGenerateWord("vegetable")} disabled={vegetable !== ""}>
                  Ziehe eine Frucht
                </button>
              ) : (
                <span className={styles.generatedWord}>{vegetable}</span>
              )}
            </div>

            <div className={styles.wordContainer}>
              {!animal ? (
                <button className={`${styles.button} ${styles.jarButton}`} onClick={() => handleGenerateWord("animal")} disabled={animal !== ""}>
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
      <footer className={styles.footer}>
        <p className="text-sm text-gray-600 mt-2">Animal Images generated using OpenAIs DALL-E.</p>
        <p>Favicon and placholder cat image generated using ChatGPT</p>
        <p>
          Background: <a href="https://pixabay.com/de/users/ds_30-1795490/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5370016">Dmitriy</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5370016">Pixabay</a>
        </p>
        <p>
          Paper-Background: Bild von <a href="https://pixabay.com/de/users/mrbandit22-4809957/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2828083">carlos gaviria</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2828083">Pixabay</a>{" "}
        </p>
        <p>
          Blot: Bild von <a href="https://pixabay.com/de/users/clker-free-vector-images-3736/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=307260">Clker-Free-Vector-Images</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=307260">Pixabay</a>
        </p>
        <p>
          Jar: Bild von <a href="https://pixabay.com/de/users/clker-free-vector-images-3736/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=311089">Clker-Free-Vector-Images</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=311089">Pixabay</a>
        </p>
      </footer>
    </div>
  );
}
