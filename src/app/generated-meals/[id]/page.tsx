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

const sanitizePrepTime = (input: any) => {
  if (!input && input !== 0) return '';
  if (Array.isArray(input)) input = input[0];
  const s = String(input).trim();
  const match = s.match(/(\d+\s*(?:hours?|hrs?|hr|minutes?|mins?|min))/i);
  if (match) return match[1].replace(/\s+/g, ' ').trim();
  const numMatch = s.match(/(\d+)/);
  if (numMatch) return `${numMatch[1]} minutes`;
  return s;
};

;

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

  const handleDelete = () => {
    if (typeof window !== "undefined" && id) {
      // Show confirmation dialog
      if (window.confirm('Are you sure you want to delete this recipe?')) {
        // Remove recipe from history
        const history = JSON.parse(localStorage.getItem("recipeHistory") || "[]");
        const updatedHistory = history.filter((r: Recipe) => r.id !== id);
        localStorage.setItem("recipeHistory", JSON.stringify(updatedHistory));

        // Remove image from storage
        const storedImages = JSON.parse(localStorage.getItem("recipeImages") || "{}");
        delete storedImages[id as string];
        localStorage.setItem("recipeImages", JSON.stringify(storedImages));

        // Navigate back to generated meals page
        router.push('/generated-meals');
      }
    }
  }

  const fetchImage = async (title: any, id: any): Promise<string> => {
      const storedImages = JSON.parse(localStorage.getItem("recipeImages") || "{}");

      if (storedImages[id]) {
        return storedImages[id];
      }

      const accessKey = unsplashKey;
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${title}&client_id=${accessKey}&h=600`);
      const data = await response.json();
      const imageUrl = data.results?.[0]?.urls?.regular || "https://via.placeholder.com/600";

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

  //const calories = 
  const filteredMacros = Array.isArray(recipe.macros) ? recipe.macros.filter((m: string) => !m.toLowerCase().includes('calories') && !m.toLowerCase().includes('cal')) : [];

  return (
    <div className={`${styles['recipe-detail-page']}`}>
      <div className={styles['top-actions']}>
        <button 
          onClick={() => router.push('/generated-meals')} 
          className={styles['back-button']}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        
        <button 
          onClick={handleDelete} 
          className={styles['delete-button']}
        >
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
      
      <div className={styles['recipe-header']}>
        {imageUrls[recipe.id] && (
          <img 
            src={imageUrls[recipe.id]} 
            alt={recipe.title}
            className={styles['recipe-image']}
          />
        )}
        
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h2 className={styles['recipe-title']}>{recipe.title}</h2>
            <p className={styles['recipe-description']}>
              A protein-packed meal with tender grilled chicken breast served over fluffy quinoa
            </p>
          </div>
          <span className={styles['time-badge']}>
            <i className="bi bi-clock"></i> {sanitizePrepTime(recipe.preparation_time)}
          </span>
        </div>

        <div className={styles['macros-bar']}>
          <div className={styles['calories-section']}>
            <i className="bi bi-fire"></i>
            <span className={styles['calories-value']}>{recipe.calories}</span>
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
