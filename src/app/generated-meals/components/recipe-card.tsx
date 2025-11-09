import React from 'react';
import type { Recipe } from '../../types/recipe';
import styles from '../page.module.scss';

interface RecipeCardProps {
    recipe: Recipe;
    imageUrl: string;
}

const parseMacro = (macro: string) => {
    const [name, value] = macro.split(':').map(part => part.trim());
    return { name: name || '', value: value || '' };
};

const sanitizePrepTime = (input: any) => {
    if (!input && input !== 0) return '';
    if (Array.isArray(input)) {
        input = input[0];
    }
    const s = String(input).trim();
    // Match patterns like '1 hour', '1 hr', '10 minutes', '20 mins', etc.
    const match = s.match(/(\d+\s*(?:hours?|hrs?|hr|minutes?|mins?|min))/i);
    if (match) return match[1].replace(/\s+/g, ' ').trim();
    // If there's a number but no unit, assume minutes
    const numMatch = s.match(/(\d+)/);
    if (numMatch) return `${numMatch[1]} minutes`;
    return s;
};
const extractCalories = (recipeOrMacros: any) => {
    const parseNumber = (s: string) => {
        const m = s.match(/(\d+)/);
        return m ? m[1] : null;
    };

    if (!recipeOrMacros) return '0';

    // If passed an array of macros
    if (Array.isArray(recipeOrMacros)) {
        const caloriesMacro = recipeOrMacros.find((m: string) => /k?cal|calories?|cal\b/i.test(m));
        if (caloriesMacro) {
            const match = caloriesMacro.match(/(\d+)\s*(k?cal|calories?|cal)/i);
            return match ? match[1] : (parseNumber(caloriesMacro) || '0');
        }
        return '0';
    }

    // If an object (recipe), check common fields
    if (typeof recipeOrMacros === 'object') {
        // check common keys first
        const candidates = ['calories', 'calaories', 'cal', 'kcal'];
        for (const key of candidates) {
            if (key in recipeOrMacros && recipeOrMacros[key]) {
                const v = String(recipeOrMacros[key]);
                const match = v.match(/(\d+)\s*(k?cal|calories?|cal)/i);
                if (match) return match[1];
                const num = parseNumber(v);
                if (num) return num;
            }
        }

        // fallback: check recipe.macros array
        if (Array.isArray(recipeOrMacros.macros)) {
            return extractCalories(recipeOrMacros.macros);
        }

        return '0';
    }

    // If string
    if (typeof recipeOrMacros === 'string') {
        const match = recipeOrMacros.match(/(\d+)\s*(k?cal|calories?|cal)/i);
        if (match) return match[1];
        const num = recipeOrMacros.match(/(\d+)/);
        return num ? num[1] : '0';
    }

    return '0';
};

const getMacroShorthand = (macroName: string) => {
    const name = macroName.toLowerCase();
    if (name.includes('protein')) return 'P';
    if (name.includes('carb')) return 'C';
    if (name.includes('fat')) return 'F';
    return macroName.charAt(0).toUpperCase();
};

export default function RecipeCard({ recipe, imageUrl }: RecipeCardProps) {
    const calories = recipe.calories;
    const filteredMacros = Array.isArray(recipe.macros) ? recipe.macros.filter((m: string) => !m.toLowerCase().includes('calories') && !m.toLowerCase().includes('cal')) : [];

    return (
       <a href={`/generated-meals/${recipe.id}`} className={styles['recipe-card-link']}>
           <div className={styles['recipe-card']} title={recipe.title}>
                <div className={styles['card-header-section']}>
                    <h5 className={styles['card-title']}>
                        {recipe.title.length > 30 ? `${recipe.title.slice(0, 30)}...` : recipe.title}
                    </h5>
                    <span className={styles['card-time-badge']}>
                        <i className="bi bi-clock"></i> {sanitizePrepTime(recipe.preparation_time)}
                    </span>
                </div>
                
                <p className={styles['card-description']}>
                    {Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 2).join(", ").length > 40 
                        ? `${recipe.ingredients.slice(0, 2).join(", ").slice(0, 40)}...` 
                        : recipe.ingredients.slice(0, 2).join(", ")}
                </p>

                <div className={styles['card-macros']}>
                    <div className={styles['card-calories']}>
                        <i className="bi bi-fire"></i>
                        <span>{calories}</span>
                    </div>
                    {filteredMacros.slice(0, 3).map((macro: string, idx: number) => {
                        const { name, value } = parseMacro(macro);
                        const shorthand = getMacroShorthand(name);
                        return (
                            <div key={idx} className={styles['card-macro-item']}>
                                <span className={styles['macro-shorthand']}>{shorthand}:</span>
                                <span className={styles['macro-val']}>{value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </a>
    );
}