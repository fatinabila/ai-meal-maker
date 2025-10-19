"use client";

import React, {useState} from 'react';
import styles from './page.module.scss';
import Loading from '../components/loading-ui';
import type { Recipe } from '../types/recipe';
import SuggestedRecipe from './components/suggested-recipe';
import GenerateMeals from './components/generate-meals';

export default function GeneratePage() {
    const [loading, setLoading] = useState(false);
    const [showRecipe, setShowRecipe] = useState(false);
    const [mealResult, setMealResult] = useState<Recipe | null>(null);

    return (

      // What ingredients do you have today?

      <div className="py-4">
      <h2 className="mb-4"> What ingredients do you have today?</h2>


      <div className='row'>
          
          {!loading && (
           <>
           
            <div className='col-lg-9 col-md-12 mb-4'>
              <GenerateMeals
              setLoading={setLoading}
              setShowRecipe={setShowRecipe}
              setMealResult={setMealResult}
              />
            </div>

            <div className='col-lg-3 col-md-12 p-0'>
              <SuggestedRecipe />
            </div>

           </>
          )}
          
          

          {loading && (
              <>
                <Loading />
                <h4 className={`${styles.heading} text-center`}>Generating your meal...</h4>
              </>
          )}
        </div>
      </div>
      

        

       
    );
}