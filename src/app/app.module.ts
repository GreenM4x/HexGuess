import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { ButtonComponent } from './components/game-board/game-components/button/button.component';
import { HeartComponent } from './components/game-board/game-components/heart/heart.component';
import { ScoreComponent } from './components/game-board/game-components/score/score.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TimerComponent } from './components/game-board/game-components/timer/timer.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from '@shared/components/header/header.component';

@NgModule({
	declarations: [
		AppComponent,
		GameBoardComponent,
		ButtonComponent,
		HeartComponent,
		ScoreComponent,
	],
	imports: [
		TimerComponent,
		BrowserModule,
		AppRoutingModule,
		HeaderComponent,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerImmediately',
		}),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
