import React from 'react';
import type { Recipe } from '../../types/recipe';
import styles from '../page.module.scss';

interface RecipeCardProps {
    recipe: Recipe;
    imageUrl: string;
}

export default function RecipeCard({ recipe, imageUrl }: RecipeCardProps) {
    return (
       <div className="border-0 card" title={recipe.title}>
                <img 
                    src={imageUrl || "https://via.placeholder.com/150"} 
                    className={`p-3 card-img-top rounded-5 ${styles['card-img-top']}`} 
                    alt={recipe.title} 
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {recipe.title.length > 2 ? `${recipe.title.slice(0, 25)}...` : recipe.title}
                    </h5>
                    <p className="card-text">
                        {Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 3).join(", ").length > 40 
                            ? `${recipe.ingredients.slice(0, 3).join(", ").slice(0, 40)}...` 
                            : recipe.ingredients.slice(0, 3).join(", ")}
                    </p>
                    <a href={`/generated-meals/${recipe.id}`} className="btn btn-outline-secondary w-100">
                        View Recipe
                    </a>
                </div>
            </div>
    );
}