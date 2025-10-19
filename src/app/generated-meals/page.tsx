"use client";

import React, {useEffect, useState} from "react";
import type {Recipe} from "../types/recipe";

import styles from './page.module.scss';

export default function GeneratedPage() {
    const [history,setHistory] = useState < Recipe[] > ([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const stored = localStorage.getItem("recipeHistory");
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);
    


    const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    const fetchImage = async (title: string, id: string): Promise<string> => {
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
            const newImageUrls: Record<string, string> = {};
            for (const recipe of history) {
                const url = await fetchImage(recipe.title, recipe.id);
                newImageUrls[recipe.id] = url;
            }
            setImageUrls(newImageUrls);
        };

        fetchImages();
    }, [history]);

    return (
        <div className="py-4">
            <h2 className="mb-4">Recipe History</h2>
            {history.length === 0
                ? (
                    <div className="alert alert-light">No recipes generated yet.</div>
                )
                : (
                    <div className="row">
                        {history.map((recipe) => (
                            <div className="col-md-6 col-xxl-2 col-xl-3 col-lg-3 mb-4 g-2" key={recipe.id}>

                                <div className="shadow border-0 card" title={recipe.title}>
                                  <img src={imageUrls[recipe.id] || "https://via.placeholder.com/150"} className={`p-3 card-img-top rounded-5 ${styles['card-img-top']}`} alt={recipe.title} />
                                  <div className="card-body">
                                    <h5 className="card-title" >{recipe.title.length > 2 ? `${recipe.title.slice(0, 25)}...` : recipe.title}</h5>
                                    <p className="card-text" >
                                      {Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 3).join(", ").length > 40 ? `${recipe.ingredients.slice(0, 3).join(", ").slice(0, 40)}...` : recipe.ingredients.slice(0, 3).join(", ")}
                                    </p>
                                    <a href={`/generated-meals/${recipe.id}`} className="btn btn-outline-secondary w-100">View Recipe</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}
