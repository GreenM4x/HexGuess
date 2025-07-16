import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOnlineLobbyComponent } from './game-online-lobby.component';

describe('GameOnlineLobbyComponent', () => {
	let component: GameOnlineLobbyComponent;
	let fixture: ComponentFixture<GameOnlineLobbyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GameOnlineLobbyComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GameOnlineLobbyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
