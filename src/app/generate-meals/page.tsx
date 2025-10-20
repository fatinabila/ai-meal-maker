"use client";

import React, {useState} from 'react';
import Loading from '../components/loading-ui';
import SuggestedRecipe from './components/suggested-recipe';
import GenerateMeals from './components/generate-meals';

export default function GeneratePage() {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    return (
      <>

      <div className="py-4">
        <h2 className="mb-4"> What ingredients do you have today?</h2>
        <div className='row'>
                
            <div className='col-lg-9 col-md-12 mb-4'>
              <GenerateMeals
              setShowError={setShowError}
              setLoading={setLoading}
              />
            </div>
            <div className='col-lg-3 col-md-12 p-0'>
              <SuggestedRecipe />
            </div>

        </div>
        
      </div>
      

       {loading && (
        <Loading loadingText="Generating your meal..." />
        )}
      </>
        

       
    );
}