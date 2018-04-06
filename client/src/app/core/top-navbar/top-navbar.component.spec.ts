import { TestBed, inject } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';

describe('a top-navbar component', () => {
	let component: TopNavbarComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				TopNavbarComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([TopNavbarComponent], (TopNavbarComponent) => {
		component = TopNavbarComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});