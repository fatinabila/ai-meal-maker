
import React from 'react';

interface LoadingProps {
    loadingText?: string;
}

export default function Loading({ loadingText = 'Generating your meal...' }: LoadingProps) {
    return (
        <div className='overlay-background'>
            <div style={{ width: '200px', textAlign: 'center' }}>
                <img src="/roasted-turkey.gif" alt="Loading..." className="mx-auto d-block w-100 rounded-pill"/>
                <h4 className='mt-4'>{loadingText}</h4>
            </div>
        </div>
    );
}
