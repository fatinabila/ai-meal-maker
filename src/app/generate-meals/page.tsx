"use client";

import React, {useState} from 'react';
import styles from './page.module.scss';

export default function IngredientsPage() {

    const [mealResult,
        setMealResult] = useState < string | null > (null);
    const [loading,
        setLoading] = useState(false);

    async function fetchMeal(prompt : string) {
        setLoading(true);
        setMealResult(null);
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
                setMealResult(`Error: ${data.error}`);
            } else {
                setMealResult(data.result);
            }

            console.log(JSON.parse(data.result));
            console.log(mealResult);
        } catch (err) {
            console.error(err);
            setMealResult('Error generating meal.');
        }
        setLoading(false);
    }

    const defaultIngredients = [
        'Garlic',
        'Salt',
        'Red Onion',
        'Chicken Breast',
        'Rice',
        'Paprika'
    ];

    const [ingredients,
        setIngredients] = useState(defaultIngredients);
    const [newIngredient,
        setNewIngredient] = useState('');
    const [macros,
        setMacros] = useState(['', '']);
    const [aiPrompt,
        setAiPrompt] = useState('');

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

    // Helper to generate prompt for OpenAI
    const generatePrompt = async() => {
        let prompt = `You are a professional chef and recipe writer. Your task is to create a clear, detailed, and 
        delicious recipe based on strictly the given ingredients for one serving.
        Instructions:
        Output only the recipe (no extra commentary).
        The recipe must include:
        Recipe name (creative and relevant)
        Preparation time and cooking time
        Ingredients list with measurements (use gram for protein and carbohydrates)
        Detailed of macro breakdown (protein, carbohydrates, fat, fiber)
        Step-by-step instructions — concise, numbered, and easy to follow
        Please cross check the macro in web and return the response in json format with keys 'title', 'preparation_time', 'ingredients', 'instructions', 'servings', and 'macros'.
        Ingredients : ${ingredients.join(', ')}.`;
        if (macros[0] || macros[1]) {
            prompt += ` Target macros:`;
            if (macros[0]) 
                prompt += ` Carb: ${macros[0]}g.`;
            if (macros[1]) 
                prompt += ` Protein: ${macros[1]}g.`;
            if (macros[2]) 
                prompt += ` Fiber: ${macros[2]}g.`;
            }
        setAiPrompt(prompt);
        await fetchMeal(prompt);
    };

    return (

        <div className={styles.container}>
            <h2 className={`${styles.heading} mt-2`}>What ingredients do you have today?</h2>

            <section className='my-5'>
                <h4 className={`${styles.subheading} mt-4`}>
                    Select from the list or type your own — we’ll craft meals from what’s available.
                </h4>

                <div className={styles['ingredient-list']}>
                    {ingredients.map(ingredient => (
                        <span key={ingredient} className={styles.ingredient}>
                            {ingredient}
                            <button
                                className={styles['remove-btn']}
                                onClick={() => removeIngredient(ingredient)}>X</button>
                        </span>
                    ))}

                </div>

                <div className="input-group mb-3">
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

            <section  className='my-5'>

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

            <div className="d-flex justify-content-center mt-4">
                <button type="button" className="btn btn-primary" onClick={generatePrompt}>
                    Generate a meal
                </button>
            </div>
            {/* {aiPrompt && (
                <div className="alert alert-info mt-4">
                    <strong>Prompt for OpenAI:</strong>
                    <div>{aiPrompt}</div>
                </div>
            )} */}
            {loading && (
                <div className="mt-4 text-center">Generating meal...</div>
            )}
            {/* {mealResult && (
                <div className="alert alert-success mt-4">
                    <strong>AI Generated Meal:</strong>
                    <div>{mealResult}</div>
                </div>
            )} */}
        </div>
    );
}