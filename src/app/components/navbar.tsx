
import React from 'react';

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light pt-2 text-center">
			<div className="container-fluid">
				<h1 className=" pt-2">AI Meal Maker</h1>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
			</div>
		</nav>
	);
}
