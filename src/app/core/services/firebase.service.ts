import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	user$: Observable<any>;

	constructor(
		private angularAuthService: AngularFireAuth,
		private router: Router
	) {
		this.user$ = angularAuthService.authState;
	}

	isLoggedIn(): Observable<boolean> {
		return this.user$.pipe(map(user => user !== null));
	}

	logout() {
		return this.angularAuthService
			.signOut()
			.then(() => this.router.navigate(['/auth']))
			.catch(err => {
				console.log(err);
			});
	}

	signInWithEmail(username: string, password: string) {
		return this.angularAuthService
			.signInWithEmailAndPassword(username, password)
			.then(() => this.router.navigate(['']))
			.catch(err => {
				console.log(err);
			});
	}

	signInWithGoogle() {
		return this.angularAuthService
			.signInWithPopup(new GoogleAuthProvider())
			.then(
				() => {
					this.router.navigate(['']);
				},
				err => {
					alert(err.message);
				}
			);
	}

	signInWithGitHub() {
		return this.angularAuthService
			.signInWithPopup(new GithubAuthProvider())
			.then(
				() => {
					this.router.navigate(['']);
				},
				err => {
					alert(err.message);
				}
			);
	}
}
