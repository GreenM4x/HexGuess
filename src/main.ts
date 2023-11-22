import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Analytics } from '@vercel/analytics/react';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
