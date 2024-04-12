import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMinus, faMoon, faXmark } from '@fortawesome/free-solid-svg-icons';
import { User } from '@shared/models/UserType.js';

@Component({
	selector: 'app-friend-list',
	standalone: true,
	imports: [FontAwesomeModule, CommonModule],
	templateUrl: './friend-list.component.html',
	styleUrl: './friend-list.component.scss',
})
export class FriendListComponent implements OnInit {
	@Input() user: User;

	faXmark = faXmark;
	faMinus = faMinus;
	faMoon = faMoon;

	ngOnInit(): void {
		this.user.imgUrl = 'https://robohash.org/' + this.user.userName + '.png';
	}

	removeFriend(): void {
		alert('Removed:' + this.user.userName);
	}
}
