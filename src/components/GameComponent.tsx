"use client";

import React, { useState } from "react";
import { generateWord, generateAnimal, getImageUrl } from "../utils/openaiController";
import styles from "./GameComponent.module.css";

export default function GameComponent() {
  const [adjective, setAdjective] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [animal, setAnimal] = useState("");
  const [funnyAnimal, setFunnyAnimal] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
        if (word) setAnimal(word);
        break;
    }
  };

  const handleGenerateFunnyAnimal = async () => {
    const funnyAnimal = await generateAnimal(adjective, vegetable, animal);
    if (funnyAnimal) setFunnyAnimal(funnyAnimal);
  };

  const handleGenerateImage = async () => {
    const url = await getImageUrl(funnyAnimal, adjective, vegetable, animal);
    if (url) setImageUrl(url);
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

        {animal && !funnyAnimal && (
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleGenerateFunnyAnimal}>
              Generate Funny Animal
            </button>
          </div>
        )}

        {funnyAnimal && (
          <div>
            <p className={styles.funnyAnimal}>{funnyAnimal}</p>
            {!imageUrl && (
              <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleGenerateImage}>
                  Generate Image
                </button>
              </div>
            )}
          </div>
        )}

        {imageUrl && <img className={styles.image} src={imageUrl} alt="Generated Funny Animal" />}

        <div className={styles.resetButtonContainer}>
          <button className={`${styles.button} ${styles.resetButton}`} onClick={resetGame}>
            Nochmal Spielen
          </button>
        </div>
      </div>
    </div>
  );
}
