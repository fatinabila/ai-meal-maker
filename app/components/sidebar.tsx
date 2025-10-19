'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../styling/sidebar.scss';

export default function Sidebar() {

  return (
    <div className='sidebar collapsed'>

         <img src="/ramen.gif" alt="Loading..." style={{ width: '50%', marginTop: '20px' }} className="mx-auto d-block rounded-5" />

      <nav className='sidebar-nav'>
        <ul className='nav-list'>
          <li className='nav-item'>
            <Link href="/generate-meals" className="nav-link">
              <i className='bi bi-house-door icon'></i>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href="/generate-meals" className="nav-link">
              <i className='bi bi-magic icon'></i>
            </Link>
          </li>
         
        </ul>
      </nav>

      {/* <div className="sidebar-footer">
        <div className={`${styles['nav-item']}`}>
          <Link href="/settings" className="nav-link">
            <i className="bi bi-gear"></i>
          </Link>
        </div>
      </div> */}

     
    </div>
  );
}