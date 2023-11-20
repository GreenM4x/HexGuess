import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './game-board/game-components/button/button.component';
import { HeartComponent } from './game-board/game-components/heart/heart.component';
import { ScoreComponent } from './game-board/game-components/score/score.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TimerComponent } from './header/timer/timer.component';

@NgModule({
	declarations: [
		AppComponent,
		GameBoardComponent,
		HeaderComponent,
		ButtonComponent,
		HeartComponent,
		ScoreComponent,
	],
	imports: [
		TimerComponent,
		BrowserModule,
		AppRoutingModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerImmediately',
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
