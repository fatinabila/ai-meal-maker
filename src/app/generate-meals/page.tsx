"use client";

import React, {useEffect, useState} from 'react';
import Loading from '../components/loading-ui';
import { Recipe } from '../types/recipe';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import RecipeCard from '../generated-meals/components/recipe-card';

export default function GeneratePage() {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [history, setHistory] = useState<Recipe[]>([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [prepTime, setPrepTime] = useState(15);
    const [ingredients, setIngredients] = useState([
        'Garlic',
        'Salt',
        'Holland Onions',
        'Chicken Breast',
        'Pasta',
        'Carbonara Sauce',
        'Cheese Slices'
    ]);
    const [newIngredient, setNewIngredient] = useState('');
    const [macros, setMacros] = useState(['30', '33', '5']);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("recipeHistory");
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    function sanitizeJsonResponse(response: string) {
        return response
            .replace(/```json|```/g, '')
            .trim();
    }

    async function fetchMeal(prompt: string) {
        setLoading(true);
        setShowError(false)
        try {
            const res = await fetch('/api/generate-meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({prompt})
            });
            const data = await res.json();
            if (data.error) {
                setShowError(true)
            } else {
                let recipeObj;
                try {
                    recipeObj = JSON.parse(sanitizeJsonResponse(data.result));
                } catch (e) {
                    setShowError(true);
                    setLoading(false);
                    return;
                }
                const recipeWithId = {
                    ...recipeObj,
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 8)
                };

                const prevHistory = JSON.parse(localStorage.getItem('recipeHistory') || '[]');
                prevHistory.push(recipeWithId);
                localStorage.setItem('recipeHistory', JSON.stringify(prevHistory));
                router.push(`/generated-meals/${recipeWithId.id}`);
            }
        } catch (err) {
            console.error(err);
            setShowError(true)
        }
        setLoading(false);
    }
    
    const generatePrompt = async () => {
      let prompt = `
      You are a **professional chef, nutritionist, and recipe writer**.
      Your goal is to create a **well-balanced, creative, and easy-to-follow recipe** for **one serving**, based on the provided ingredients.
      
      Follow these strict instructions:
      1. Output the result **only** in **valid JSON format**.2. Do not include any text outside the JSON.
      2. Do not include any text outside the JSON.
      3. Use appropriate **units of measurement** (e.g., grams, ml, tsp, kcal).
      4. If target macros are provided, **adjust the recipe proportionally** to closely match them.
  
      ### INPUT DETAILS
      - Ingredients: ${ingredients.join(', ')}.
      - Maximum preparation + cooking time: ${prepTime} minutes.
      ${(macros[0] || macros[1] || macros[2]) ? 
      `- Target macros:
        ${macros[0] ? `Carbs: ${macros[0]}g` : ""}
        ${macros[1] ? `Protein: ${macros[1]}g` : ""}
        ${macros[2] ? `Fiber: ${macros[2]}g` : ""}` : ""}

      ### JSON RESPONSE FORMAT
      {
        "id": string, // unique ID for the recipe (e.g. "recipe-001")
        "title": string, // descriptive name of the dish
        "preparation_time": string, // include units, e.g. "10 minutes"
        "cooking_time": string, // include units
        "ingredients": string[], // list with quantities and units
        "instructions": string[], // step-by-step directions
        "servings": number, // must be 1
        "macros": {
          "carbs": string, // e.g. "45g"
          "protein": string, // e.g. "25g"
          "fat": string, // e.g. "10g"
          "fiber": string // e.g. "5g"
      },
      "calories": string // e.g. "380 kcal"
      }`;
      
      await fetchMeal(prompt);
    
    };

    const removeIngredient = (ingredient: string) => {
        setIngredients(ingredients.filter(i => i !== ingredient));
    };

    const addIngredient = () => {
        if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const handleMacroChange = (index: number, value: string) => {
        const updated = [...macros];
        updated[index] = value;
        setMacros(updated);
    };
        
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
      <>
      <div className='d-flex justify-content-center'>
          <div className='text-center' style={{ fontSize: '35px', fontWeight: 600 , marginRight: '15px'}}>
            Meal Generator 
          </div>
      </div>

      <p className='text-center'>Create personalized meals based on your ingredients, macros, and time</p>

      <div className='row'>
        <div className='col-md-6 mt-4'>
          <div className="card w-100 h-100 border-0" >
            <div className="card-body p-4">
              <h5 className="card-title">Ingredients</h5>
              <h6 className="card-subtitle mb-4 text-body-secondary fw-light">Add the ingredients you have available</h6>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {ingredients.map(ingredient => (
                  <span
                    key={ingredient}
                    className="tag-color p-2 d-inline-flex align-items-center">
                    {ingredient}
                    <button
                      className="btn btn-sm text-light border-0 ms-2 p-0"
                      onClick={() => removeIngredient(ingredient)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </span>
                ))}
              </div>

              <div className="input-group mt-auto">
                <input
                  type="text"
                  value={newIngredient}
                  className="form-control form-control-sm p-2"
                  placeholder="Type an ingredient and press Enter..."
                  onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  onChange={e => setNewIngredient(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-6 mt-4'>
          <div className="card w-100 h-100 border-0" >
            <div className="card-body p-4">
              <h5 className="card-title">Macro Preferences</h5>
              <h6 className="card-subtitle mb-4 text-body-secondary fw-light">Set your desired macro targets</h6>
              <div className="d-flex flex-column gap-4">
                <div className="macro-slider">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Protein</span>
                    <span>{macros[0]}g</span>
                  </div>
                  <div className="position-relative">
                    <div className={styles.macroContainer}>
                      <div className={styles.macroTrack}></div>
                      <div className={styles.macroFill} style={{ width: `${(Number(macros[0]) / 100) * 100}%` }}></div>
                      <input
                        type="range"
                        className={styles.rangeInput}
                        min="0"
                        max="100"
                        value={macros[0]}
                        onChange={e => handleMacroChange(0, e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="macro-slider">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Carbs</span>
                    <span>{macros[1]}g</span>
                  </div>
                  <div className="position-relative">
                    <div className={styles.macroContainer}>
                      <div className={styles.macroTrack}></div>
                      <div className={styles.macroFill} style={{ width: `${(Number(macros[1]) / 100) * 100}%` }}></div>
                      <input
                        type="range"
                        className={styles.rangeInput}
                        min="0"
                        max="100"
                        value={macros[1]}
                        onChange={e => handleMacroChange(1, e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="macro-slider">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Fats</span>
                    <span>{macros[2]}g</span>
                  </div>
                  <div className="position-relative">
                    <div className={styles.macroContainer}>
                      <div className={styles.macroTrack}></div>
                      <div className={styles.macroFill} style={{ width: `${(Number(macros[2]) / 100) * 100}%` }}></div>
                      <input
                        type="range"
                        className={styles.rangeInput}
                        min="0"
                        max="100"
                        value={macros[2]}
                        onChange={e => handleMacroChange(2, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-12 mt-4'>
          <div className="card w-100 border-0" >
            <div className="card-body p-4">
              <h5 className="card-title">Preparation Time</h5>
              <h6 className="card-subtitle mb-4 text-body-secondary fw-light">How much time do you have?</h6>
              <div className="btn-group btn-group-sm w-100" role="group" aria-label="Meal prep time">
                <input
                  type="radio"
                  className="btn-check"
                  name="prepTime"
                  id="prep15"
                  autoComplete="off"
                  checked={prepTime === 15}
                  onChange={() => setPrepTime(15)}
                />
                <label className={`${styles.btnCustom} btn p-2`} htmlFor="prep15">Under 15 mins</label>
                <input
                  type="radio"
                  className="btn-check"
                  name="prepTime"
                  id="prep30"
                  autoComplete="off"
                  checked={prepTime === 30}
                  onChange={() => setPrepTime(30)}
                />
                <label className={`${styles.btnCustom} btn p-2`} htmlFor="prep30">Under 30 mins</label>
                <input
                  type="radio"
                  className="btn-check"
                  name="prepTime"
                  id="prep60"
                  autoComplete="off"
                  checked={prepTime === 60}
                  onChange={() => setPrepTime(60)}
                />
                <label className={`${styles.btnCustom} btn p-2`} htmlFor="prep60">Under 60 mins</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4 mb-4">
        <button
          type="button"
          className="btn btn-submit btn-sm p-2"
          onClick={generatePrompt}>
          Generate a Meal
         <i className="bi bi-magic mx-2"></i>
        </button>
      </div>

      {/* Previous meals (history cards) */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Previous Meals</h3>
          <button className="btn text-underline btn-sm" onClick={() => router.push('/generated-meals')}>View All</button>
        </div>

        {history.length === 0 ? (
          <div className="alert alert-light">No recipes generated yet.</div>
        ) : (
          <div className="row">
            {history.map((recipe) => (
              <div className="col-md-6 col-xxl-3 col-xl-3 col-lg-3 mb-4 g-4" key={recipe.id}>
                <RecipeCard recipe={recipe} imageUrl={imageUrls[recipe.id]} />
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && <Loading />}
      {showError && (
        <div className="alert alert-danger" role="alert">
          An error occurred while generating the meal. Please try again.
        </div>
      )}
      </>
    );
}