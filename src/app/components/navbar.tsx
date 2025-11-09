
import React from 'react';

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light pt-2 text-center sticky-navbar">
			<div className="container-fluid">

<div className='d-flex'>
	<img src="/ramen.gif" alt="Loading..." style={{ width: '50px' }} className="mx-auto d-block rounded-5" />
<h4 className="mt-3">AI Meal Maker</h4>
</div>
				
					
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
			</div>
		</nav>
	);
}
