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

  return (
    <div className='w-100'>
      <h5 className='mb-4'>

        <i className="bi bi-arrow-left cursor-pointer mx-2" onClick={handleBackButton}></i>
        {recipe.title}
        <span className="badge text-bg-secondary mx-2" >{recipe.preparation_time}</span>
        <span className="badge text-bg-secondary mx-2" >{recipe.servings}</span>
      </h5>

      <div className="row">

        <div className="col-lg-6 col-xl-4 col-md-12 p-4">

          <img src={imageUrls[recipe.id]} className={`img-fluid w-100 rounded-4  ${styles['card-img-top']}`} alt={recipe.title} />
          
          <div className="card my-4 ">
            <div className="card-body">
              <div className="d-flex justify-content-center align-items-center mt-2">
                {Array.isArray(recipe.macros) && recipe.macros.map((macro: string, idx: number) => {
                  const { name, value } = parseMacro(macro);
                  return (
                    <div key={idx} className="flex-fill text-dark rounded px-2 py-1 small text-center">
                      <div className="fw-bold">{name}</div>
                      <div>{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <h6>Ingredients</h6>
          <div className="">
             {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient: string, index: number) => (
              <div className="p-3 card my-1" key={index}>{ingredient}</div>
            ))}

          </div>
        </div>

        <div className="col-lg-6 col-xl-8 col-md-12 p-4 mt-4 text-bg-light rounded-4">
          <h6>Instructions</h6>
          <div className="">
            {Array.isArray(recipe.instructions) && recipe.instructions.map((step: string, index: number) => (
              <div className="my-4" key={index}>{step}</div>
            ))}
          </div>
        </div>

      </div>

      
    </div>
  );
}
