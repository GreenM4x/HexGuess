import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@core/services/firebase.service.js';
import { FriendListComponent } from './friend-list/friend-list.component.js';
import { Firend } from '@shared/models/friendType.js';

@Component({
	selector: 'app-user-profile',
	standalone: true,
	imports: [FriendListComponent],
	templateUrl: './user-profile.component.html',
	styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
	constructor(private firebaseService: FirebaseService) {}

	userName: string = '';
	imgUrl: string = 'https://robohash.org/' + this.userName + '.png';

	friendlist: Firend[] = [
		{ name: 'Lucas', onlineStatus: 'online' },
		{ name: 'Felix', onlineStatus: 'bussy' },
		{ name: 'Jenny', onlineStatus: 'offline' },
		{ name: 'Gabi', onlineStatus: 'idle' },
	];

	ngOnInit(): void {
		this.setUserData();
	}

	setUserData() {
		this.firebaseService.user$.subscribe({
			next: async user => {
				const userId = user.uid;
				let userName = '';
				if (user.displayName) {
					userName = user.displayName;
				} else {
					userName = await this.firebaseService.getUsernameFromUserId(userId);
				}

				this.userName = userName;
				this.imgUrl = 'https://robohash.org/' + this.userName + '.png';
			},
		});
	}
}
