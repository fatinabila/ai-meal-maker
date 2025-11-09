export type Ingredient = {
    ingredient: string;
    amount: number;
    unit: string;
};

export type Macros = {
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
};

export type Recipe = {
    title: string;
    preparation_time: string;
    cooking_time: string;
    ingredients: string[];
    instructions: string[];
    servings: number;
    macros: string[];
    id:string;
    calories:string;
};
