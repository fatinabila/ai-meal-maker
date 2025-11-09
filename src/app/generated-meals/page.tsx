"use client";

import React, {useEffect, useState} from "react";
import type {Recipe} from "../types/recipe";
import RecipeCard from './components/recipe-card';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';

export default function GeneratedPage() {
    const [history,setHistory] = useState < Recipe[] > ([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const router = useRouter();

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
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${title}&client_id=${accessKey}&h=1200`);
      const data = await response.json();
      const imageUrl = data.results?.[0]?.urls?.regular || "https://via.placeholder.com/600";

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
        <div className={`py-4 ${styles['recipe-page']}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex">
                      <i className="bi bi-arrow-left mt-2 mr-4"  onClick={() => router.push('/generate-meals')}></i> 
                <h2 className="mb-0">
                  
                    Recipe History
                </h2>
                </div>
                
               
            </div>
            {history.length === 0
                ? (
                    <div className="alert alert-light">No recipes generated yet.</div>
                )
                : (
                    <div className="row">
                        {history.map((recipe) => (
                             <div className="col-md-6 col-xxl-3 col-xl-3 col-lg-3 mb-4 g-4">
                                <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                imageUrl={imageUrls[recipe.id]}
                            />
                             </div>
                         
                        ))}
                    </div>
                )}
        </div>
    );
}
