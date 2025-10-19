"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Recipe } from "../types/recipe";

export default function GeneratedPage() {
  const [history, setHistory] = useState<Recipe[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recipeHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Recipe History</h2>
      {history.length === 0 ? (
        <div className="alert alert-info">No recipes generated yet.</div>
      ) : (
        <div className="row">
          {history.map((recipe) => (
            <div className="col-md-6 col-lg-4 mb-4" key={recipe.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <div className="mb-2">
                    <span className="badge bg-secondary me-2">{recipe.preparation_time}</span>
                    <span className="badge bg-info">Servings: {recipe.servings}</span>
                  </div>
                  <p className="card-text">
                    {Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 3).join(", ")}
                    {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 3 && "..."}
                  </p>
                  <Link href={`/generated-meals/${recipe.id}`} className="btn btn-primary btn-sm">
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
