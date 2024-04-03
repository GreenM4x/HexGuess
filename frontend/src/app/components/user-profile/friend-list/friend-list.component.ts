import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	faGlobe,
	faMinus,
	faMoon,
	faRobot,
	faStar,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Firend } from '@shared/models/friendType.js';

@Component({
	selector: 'app-friend-list',
	standalone: true,
	imports: [FontAwesomeModule, CommonModule],
	templateUrl: './friend-list.component.html',
	styleUrl: './friend-list.component.scss',
})
export class FriendListComponent implements OnInit {
	@Input() friend: Firend;
	imgUrl: string = '';

	faXmark = faXmark;
	faMinus = faMinus;
	faMoon = faMoon;

	ngOnInit(): void {
		this.imgUrl = 'https://robohash.org/' + this.friend.name + '.png';
	}

	removeFriend(): void {
		alert('Removed:' + this.friend.name);
	}
}
