"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipe";

export default function GeneratedMealPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const history = JSON.parse(localStorage.getItem("recipeHistory") || "[]");
      const found = history.find((r: Recipe) => r.id === id);
      setRecipe(found || null);
    }
  }, [id]);

  const [selectedTab, setSelectedTab] = useState<'ingredient' | 'instruction' | 'nutrition'>('ingredient');

  const handleBackButton = () => {
    router.push('/generate-meals');
  }

  if (!recipe) {
    return <div className="container py-4"><div className="alert alert-danger">Recipe not found.</div></div>;
  }

  return (
    <div className='w-100'>
      <h4 className='mb-4'>
        <i className="bi bi-arrow-left cursor-pointer" onClick={handleBackButton}></i>
        {recipe.title}
        <span className="badge text-bg-secondary mx-2" >{recipe.preparation_time}</span>
      </h4>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
            {Array.isArray(recipe.macros) && recipe.macros.map((macro: string, idx: number) => (
              <div key={idx} className="flex-fill text-dark rounded px-2 py-1 small text-center">
                {macro}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='w-70'>
        <div className="btn-group w-100 my-4" role="group" aria-label="Recipe section toggle">
          <input
            type="radio"
            className="btn-check"
            name="tab"
            id="tab-ingredient"
            autoComplete="off"
            checked={selectedTab === 'ingredient'}
            onChange={() => setSelectedTab('ingredient')}
          />
          <label className="btn btn-outline-primary" htmlFor="tab-ingredient">Ingredient</label>

          <input
            type="radio"
            className="btn-check"
            name="tab"
            id="tab-instruction"
            autoComplete="off"
            checked={selectedTab === 'instruction'}
            onChange={() => setSelectedTab('instruction')}
          />
          <label className="btn btn-outline-primary" htmlFor="tab-instruction">Instruction</label>
        </div>
      </div>

      {selectedTab === 'ingredient' && (
        <div>
          <ul className='list-group'>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient: string, index: number) => (
              <li className="list-group-item p-3" key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedTab === 'instruction' && (
        <div>
          <ol className='list-group list-group-numbered'>
            {Array.isArray(recipe.instructions) && recipe.instructions.map((step: string, index: number) => (
              <li className="list-group-item p-3" key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {selectedTab === 'nutrition' && (
        <div>
          <ul>
            {Array.isArray(recipe.macros) && recipe.macros.map((macro: string, index: number) => (
              <li key={index}>{macro}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
