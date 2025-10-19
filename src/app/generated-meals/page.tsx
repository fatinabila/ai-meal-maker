"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import type {Recipe}
from "../types/recipe";

export default function GeneratedPage() {
    const [history,setHistory] = useState < Recipe[] > ([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const stored = localStorage.getItem("recipeHistory");
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            const newImageUrls: Record<string, string> = {};
            for (const recipe of history) {
                const url = await fetchImage(recipe.title);
                newImageUrls[recipe.id] = url;
            }
            setImageUrls(newImageUrls);
        };

        fetchImages();
    }, [history]);

    const getCalories = (macros : string[]) : string => {
        const caloriesInfo = macros.find((macro) => macro.toLowerCase().includes("calories"));
        if (caloriesInfo) {
            const match = caloriesInfo.match(/\d+/); // Extract numeric value
            return match
                ? `${match[0]} kcal`
                : "Unknown kcal";
        }
        return "Unknown kcal";
    };


    const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    const fetchImage = async (title: string): Promise<string> => {
      const accessKey = unsplashKey;
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${title}&client_id=${accessKey}`);
      const data = await response.json();
        return data.results?.[0]?.urls?.small || "https://via.placeholder.com/150"; // Fallback to placeholder image
    };

    return (
        <div className="py-4">
            <h2 className="mb-4">Recipe History</h2>
            {history.length === 0
                ? (
                    <div className="alert alert-info">No recipes generated yet.</div>
                )
                : (
                    <div className="row">
                        {history.map((recipe) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={recipe.id}>

                                <div className="card" style={{ width: "18rem" }}>
                                  <img src={imageUrls[recipe.id] || "https://via.placeholder.com/150"} className="card-img-top" alt={recipe.title} />
                                  <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <p className="card-text">{Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 3).join(", ")}</p>
                                    <a href="#" className="btn btn-primary">Go somewhere</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}
