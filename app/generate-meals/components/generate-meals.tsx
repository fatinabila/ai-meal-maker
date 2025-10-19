"use client";

import React, {useState} from 'react';
import styles from '../page.module.scss';
import { useRouter } from 'next/navigation';


interface GenerateMealsProps {
    setLoading: (loading: boolean) => void;
    setShowRecipe: (show: boolean) => void;
    setMealResult: (result: any) => void;
}

export default function GenerateMeals({ setLoading, setShowRecipe, setMealResult }: GenerateMealsProps) {

    // Get recipe history from localStorage, or empty array if not present
    const recipeHistory = JSON.parse(localStorage.getItem('recipeHistory') || '[]');
    const [prepTime, setPrepTime] = useState(15);
    const router = useRouter();

    function sanitizeJsonResponse(response: string) {
        return response.replace(/```json|```/g, '').trim();
    }

    async function fetchMeal(prompt: string) {
        setLoading(true);
        setMealResult(null);
        try {
            const res = await fetch('/api/generate-meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            if (data.error) {
                setMealResult(`Error: ${data.error}`);
                setShowRecipe(false);
            } else {
                // Sanitize and parse the result
                let recipeObj;
                try {
                    recipeObj = JSON.parse(sanitizeJsonResponse(data.result));
                } catch (e) {
                    setMealResult('Error parsing recipe result.');
                    setShowRecipe(false);
                    setLoading(false);
                    return;
                }
                // Assign a unique id to the recipe
                const recipeWithId = {
                    ...recipeObj,
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 8)
                };

                console.log(data.result);
                console.log(recipeWithId);
                setMealResult(recipeWithId);
                setShowRecipe(true);
                // Add new recipe to history in localStorage
                const prevHistory = JSON.parse(localStorage.getItem('recipeHistory') || '[]');
                prevHistory.push(recipeWithId);
                localStorage.setItem('recipeHistory', JSON.stringify(prevHistory));
                router.push(`/generated-meals/${recipeWithId.id}`);
            }
        } catch (err) {
            console.error(err);
            setMealResult('Error generating meal.');
        }
        setLoading(false);
    }

    const generatePrompt = async() => {
        let prompt = `You are a professional chef and recipe writer. 
        Your task is to create a clear, detailed, and delicious recipe based on strictly the given ingredients 
        for one serving. Return the response in json format with keys 'title', 
        'preparation_time', 'ingredients', 'instructions', 'servings', and 'macros'.
        Each keys consist array of string and return all value with the appropriate measurement units (kcal, gram etc)
        Ingredients : ${ingredients.join(', ')}.`;
        if (macros[0] || macros[1] || macros[2]) {
            prompt += ` Target macros:`;
            if (macros[0]) 
                prompt += ` Carb: ${macros[0]}g.`;
            if (macros[1]) 
                prompt += ` Protein: ${macros[1]}g.`;
            if (macros[2]) 
                prompt += ` Fiber: ${macros[2]}g.`;
            }
        prompt += ` The meal should be able to be prepared in under ${prepTime} minutes.`;

        await fetchMeal(prompt);
    };

    const defaultIngredients = [
        'Garlic',
        'Salt',
        'Holland Onions',
        'Chicken Breast',
        'Pasta',
        'Carbonara Sauce',
        'Cheese Slices'
    ];

    const [ingredients, setIngredients] = useState(defaultIngredients);
    const [newIngredient, setNewIngredient] = useState('');
    const [macros, setMacros] = useState(['', '', '']);

    const removeIngredient = (ingredient : string) => {
        setIngredients(ingredients.filter(i => i !== ingredient));
    };

    const addIngredient = () => {
        if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
            setIngredients([
                ...ingredients,
                newIngredient.trim()
            ]);
            setNewIngredient('');
        }
    };

    const handleMacroChange = (index : number, value : string) => {
        const updated = [...macros];
        updated[index] = value;
        setMacros(updated);
    };

    return (
        <div>

            <section className={`${styles.sectionContainer} bg-warning-subtle`}>
                <h4 className={`${styles.subheading} mt-4`}>
                    Select from the list or type your own — we’ll craft meals from what’s available.
                </h4>
                <div className={styles['ingredient-list']}>
                    {ingredients.map(ingredient => (
                        <span key={ingredient} className={styles.ingredient}>
                            {ingredient}
                            <button
                                className={styles['remove-btn']}
                                onClick={() => removeIngredient(ingredient)}>
                                <i className="bi bi-x-lg ml-2"></i>
                            </button>
                        </span>
                    ))}
                </div>
                <div className="input-group mb-3 w-70">
                    <input
                        type="text"
                        value={newIngredient}
                        className={`form-control ${styles['add-input']}`}
                        placeholder="Add ingredient"
                        onBlur={addIngredient}
                        onChange={e => setNewIngredient(e.target.value)}/>
                    <span className="input-group-text" id="basic-addon2" onClick={addIngredient}>+</span>
                </div>
            </section>
            <section className={`${styles.sectionContainer}`}>
                <h4 className={`${styles.subheading} mt-4`}>What macros are you aiming for?</h4>
                <div className={`d-flex`}>
                    <div className="form-floating mb-1">
                        <input
                            type="email"
                            placeholder="Carbohydrates"
                            className="form-control"
                            id="macro1"
                            onChange={e => handleMacroChange(0, e.target.value)}/>
                        <label htmlFor="macro1">Carbohydrates (g)</label>
                    </div>
                    <div className="form-floating mb-1 mx-3">
                        <input
                            type="email"
                            placeholder="Protein"
                            className="form-control"
                            id="macro2"
                            onChange={e => handleMacroChange(1, e.target.value)}/>
                        <label htmlFor="macro1">Protein (g)</label>
                    </div>
                    <div className="form-floating mb-1">
                        <input
                            type="email"
                            placeholder="Fiber"
                            className="form-control"
                            id="macro3"
                            onChange={e => handleMacroChange(2, e.target.value)}/>
                        <label htmlFor="macro3">Fiber (g)</label>
                    </div>
                </div>
            </section>
            <section className={`${styles.sectionContainer}`}>
                <h4 className={`${styles.subheading} mt-4`}>How much time do you have to cook?</h4>
                <div className="mb-4">
                    <div className="btn-group w-100" role="group" aria-label="Meal prep time">
                        <input
                            type="radio"
                            className="btn-check"
                            name="prepTime"
                            id="prep15"
                            autoComplete="off"
                            checked={prepTime === 15}
                            onChange={() => setPrepTime(15)}/>
                        <label className="btn btn-outline-warning" htmlFor="prep15">Under 15 mins</label>
                        <input
                            type="radio"
                            className="btn-check"
                            name="prepTime"
                            id="prep30"
                            autoComplete="off"
                            checked={prepTime === 30}
                            onChange={() => setPrepTime(30)}/>
                        <label className="btn btn-outline-warning" htmlFor="prep30">Under 30 mins</label>
                        <input
                            type="radio"
                            className="btn-check"
                            name="prepTime"
                            id="prep60"
                            autoComplete="off"
                            checked={prepTime === 60}
                            onChange={() => setPrepTime(60)}/>
                        <label className="btn btn-outline-warning" htmlFor="prep60">Under 60 mins</label>
                    </div>
                </div>
            </section>

            <div className="d-flex justify-content-center mt-4 mb-4">
                <button
                    type="button"
                    className="btn btn-warning btn-lg"
                    onClick={generatePrompt}>
                    Generate a Meal
                </button>
            </div>

        </div>
    )
}