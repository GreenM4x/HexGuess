import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerUpdateService {
	constructor(private swUpdate: SwUpdate) {}

	public checkForUpdate() {
		return this.swUpdate.versionUpdates.pipe(
			filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
		);
	}
}
