
import React from 'react';

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light pt-2 text-center sticky-navbar">
			<div className="container-fluid">
				<h4 className="px-4 pt-2">AI Meal Maker</h4>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
			</div>
		</nav>
	);
}
