import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@core/services/firebase.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: true,
	imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
	isLoggedIn: Observable<boolean> = new Observable<boolean>;

	constructor(private fbService: FirebaseService){}

	ngOnInit(): void {
		this.isLoggedIn = this.fbService.isLoggedIn()
	}

	logout() {
		this.fbService.logout();
	  }


}
