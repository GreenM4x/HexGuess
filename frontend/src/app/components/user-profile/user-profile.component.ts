import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@core/services/firebase.service.js';
import { FriendListComponent } from './friend-list/friend-list.component.js';
import { User } from '@shared/models/UserType.js';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMinus, faMoon, faXmark } from '@fortawesome/free-solid-svg-icons';

import { StatsComponent } from './stats/stats.component.js';

@Component({
	selector: 'app-user-profile',
	standalone: true,
	imports: [
		FriendListComponent,
		CommonModule,
		FontAwesomeModule,
		StatsComponent,
	],
	templateUrl: './user-profile.component.html',
	styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
	constructor(private firebaseService: FirebaseService) {}

	faXmark = faXmark;
	faMinus = faMinus;
	faMoon = faMoon;

	user: User = {
		userName: '',
		imgUrl: 'https://robohash.org/dummy.png',
		onlineStatus: 'idle',
		stats: [
			{ name: 'highscore_inifite', value: 9003 },
			{ name: 'online_wins', value: 36 },
			{ name: 'hightscore_top10', value: 445 },
		],
		achievements: [
			{ name: 'Beeing cool', obtained: true },
			{ name: 'win_1000_games', obtained: false },
			{ name: 'over9000', obtained: true },
		],
	};

	friendlist: User[] = [
		{
			userName: 'Lucas',
			imgUrl: 'https://robohash.org/dummy.png',
			onlineStatus: 'online',
		},
		{
			userName: 'Felix',
			imgUrl: 'https://robohash.org/dummy.png',
			onlineStatus: 'busy',
		},
		{
			userName: 'Jenny',
			imgUrl: 'https://robohash.org/dummy.png',
			onlineStatus: 'offline',
		},
		{
			userName: 'Gabi',
			imgUrl: 'https://robohash.org/dummy.png',
			onlineStatus: 'idle',
		},
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

				this.user.userName = userName;
				this.user.imgUrl =
					'https://robohash.org/' + this.user.userName + '.png';
			},
		});
	}
}
