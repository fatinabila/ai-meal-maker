"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipe";
import styles from '../page.module.scss';

const parseMacro = (macro: string) => {
  // Split the macro string into name and value
  const [name, value] = macro.split(':').map(part => part.trim());
  return {
    name: name || '',
    value: value || ''
  };
};

const extractCalories = (macros: string[]) => {
  const caloriesMacro = macros.find(m => m.toLowerCase().includes('calories') || m.toLowerCase().includes('cal'));
  if (caloriesMacro) {
    const match = caloriesMacro.match(/(\d+)\s*(cal|calories)/i);
    return match ? match[1] : '0';
  }
  return '0';
};

const getMacroValue = (macro: string) => {
  const { name, value } = parseMacro(macro);
  return { name: name.charAt(0).toUpperCase() + name.slice(1), value };
};

export default function GeneratedMealPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const router = useRouter();
  const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const history = JSON.parse(localStorage.getItem("recipeHistory") || "[]");
      const found = history.find((r: Recipe) => r.id === id);
      setRecipe(found || null);
    }
  }, [id]);

  const handleBackButton = () => {
    router.push('/generated-meals');
  }

  const fetchImage = async (title: any, id: any): Promise<string> => {
      const storedImages = JSON.parse(localStorage.getItem("recipeImages") || "{}");

      if (storedImages[id]) {
        return storedImages[id];
      }

      const accessKey = unsplashKey;
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${title}&client_id=${accessKey}&h=600`);
      const data = await response.json();
      const imageUrl = data.results?.[0]?.urls?.small || "https://via.placeholder.com/150";

      storedImages[id] = imageUrl;
      localStorage.setItem("recipeImages", JSON.stringify(storedImages));

      return imageUrl;
  };
  
  useEffect(() => {
      const fetchImages = async () => {
        if (!recipe) return;
        const newImageUrls: Record<string, string> = {};
        const url = await fetchImage(recipe.title, recipe.id);
        newImageUrls[recipe.id] = url;
        setImageUrls(newImageUrls);
      };
  
      fetchImages();
    }, [recipe]);

  if (!recipe) {
    return <div className="w-100 py-4"><div className="alert alert-light">Recipe not found.</div></div>;
  }

  const calories = extractCalories(recipe.macros);
  const filteredMacros = recipe.macros.filter(m => !m.toLowerCase().includes('calories') && !m.toLowerCase().includes('cal'));

  return (
    <div className={`${styles['recipe-detail-page']}`}>
      <button 
        onClick={() => router.push('/generate-meals')} 
        className={styles['back-button']}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>
      
      <div className={styles['recipe-header']}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h2 className={styles['recipe-title']}>{recipe.title}</h2>
            <p className={styles['recipe-description']}>
              A protein-packed meal with tender grilled chicken breast served over fluffy quinoa
            </p>
          </div>
          <span className={styles['time-badge']}>
            <i className="bi bi-clock"></i> {recipe.preparation_time}
          </span>
        </div>

        <div className={styles['macros-bar']}>
          <div className={styles['calories-section']}>
            <i className="bi bi-fire"></i>
            <span className={styles['calories-value']}>{calories} cal</span>
          </div>
          <div className={styles['macros-list']}>
            {filteredMacros.map((macro: string, idx: number) => {
              const { name, value } = getMacroValue(macro);
              return (
                <div key={idx} className={styles['macro-item']}>
                  <span className={styles['macro-label']}>{name}:</span>
                  <span className={styles['macro-value']}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles['recipe-content']}>
        <div className={styles['ingredients-section']}>
          <h3 className={styles['section-title']}>Ingredients</h3>
          <ul className={styles['ingredients-list']}>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index} className={styles['ingredient-item']}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className={styles['instructions-section']}>
          <h3 className={styles['section-title']}>Instructions</h3>
          <div className={styles['instructions-list']}>
            {Array.isArray(recipe.instructions) && recipe.instructions.map((step: string, index: number) => (
              <div key={index} className={styles['instruction-step']}>
                <span className={styles['step-number']}>{index + 1}</span>
                <span className={styles['step-text']}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
