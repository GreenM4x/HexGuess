import { inject } from '@vercel/analytics';

inject();

import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { isDevMode, importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(
			BrowserModule,
			AppRoutingModule,
			ServiceWorkerModule.register('ngsw-worker.js', {
				enabled: !isDevMode(),
				registrationStrategy: 'registerImmediately',
			}),
			AngularFireModule.initializeApp(environment.firebase),
			AngularFirestoreModule,
			AngularFireAnalyticsModule,
			AngularFireAuthModule,
			FormsModule,
			CommonModule
		),
	],
}).catch(err => console.error(err));
