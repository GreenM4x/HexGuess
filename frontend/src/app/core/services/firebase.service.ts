import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
	GoogleAuthProvider,
	GithubAuthProvider,
	User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseError } from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	user$: Observable<User | null>;

	constructor(
		private angularAuthService: AngularFireAuth,
		private firestore: AngularFirestore,
		private router: Router
	) {
		this.user$ = this.angularAuthService.authState;
	}

	isLoggedIn(): Observable<boolean> {
		return this.user$.pipe(map(user => user !== null));
	}

	public async getCurrentUser(): Promise<User | null> {
		return this.angularAuthService.currentUser;
	}

	public async getIdToken(): Promise<string | null> {
		const user = await this.angularAuthService.currentUser;
		if (user) {
			return user.getIdToken();
		}
		return null;
	}

	public async getUsernameFromUserId(userId: string): Promise<string> {
		if (userId) {
			try {
				const playerDoc = await this.firestore
					.collection('players')
					.doc<{ username: string }>(userId)
					.ref.get();

				if (playerDoc.exists) {
					return playerDoc.data()?.username ?? 'Anonymous User 👀';
				}
			} catch (error) {
				console.error('Error fetching username:', error);
			}
		}
		return 'Anonymous User 👀';
	}

	public async logout() {
		try {
			await this.angularAuthService.signOut();
			await this.router.navigate(['/auth']);
		} catch (err) {
			throw this.getErrorMessage(err as FirebaseError);
		}
	}

	public async signUpWithEmail(
		email: string,
		password: string,
		username: string
	) {
		try {
			const userNameExists = await this.checkUsernameExists(username);
			if (userNameExists) {
				throw new Error('Username already taken');
			} else {
				const userCredential =
					await this.angularAuthService.createUserWithEmailAndPassword(
						email,
						password
					);
				await this.createPlayerAndUsername(userCredential, username);
				return userCredential;
			}
		} catch (err) {
			throw this.getErrorMessage(err as FirebaseError);
		}
	}

	public async signInWithEmail(email: string, password: string) {
		try {
			return await this.angularAuthService.signInWithEmailAndPassword(
				email,
				password
			);
		} catch (err) {
			throw this.getErrorMessage(err as FirebaseError);
		}
	}

	public async signInWithGoogle() {
		try {
			const userAuth = await this.angularAuthService.signInWithPopup(
				new GoogleAuthProvider()
			);

			if (userAuth.user.displayName && userAuth.additionalUserInfo?.isNewUser) {
				await this.initPlayer(userAuth);
			}
			return userAuth;
		} catch (err) {
			throw this.getErrorMessage(err as FirebaseError);
		}
	}

	public async signInWithGitHub() {
		try {
			const userAuth = await this.angularAuthService.signInWithPopup(
				new GithubAuthProvider()
			);

			if (userAuth.user.displayName && userAuth.additionalUserInfo?.isNewUser) {
				await this.initPlayer(userAuth);
			}
			return userAuth;
		} catch (err) {
			throw this.getErrorMessage(err as FirebaseError);
		}
	}

	private async initPlayer(userAuth: firebase.default.auth.UserCredential) {
		try {
			const displayName = this.sanitizeUsername(userAuth.user.displayName);
			const userNameExists = await this.checkUsernameExists(displayName);
			if (!userNameExists) {
				await this.createPlayerAndUsername(userAuth, displayName);
			} else {
				throw new Error(
					'Username already taken. Please choose a different username.'
				);
			}
		} catch (err) {
			throw this.getErrorMessage(err as FirebaseError);
		}
	}

	private async checkUsernameExists(username: string): Promise<boolean> {
		try {
			const docSnapshot = await this.firestore
				.collection('usernames')
				.doc(username.toLowerCase())
				.ref.get();

			return docSnapshot.exists;
		} catch (error) {
			console.error('Error checking username:', error);
			return false;
		}
	}

	private async createPlayerAndUsername(
		userCredential: firebase.default.auth.UserCredential,
		username: string
	) {
		const batch = this.firestore.firestore.batch();

		const playerRef = this.firestore
			.collection('players')
			.doc(userCredential.user.uid).ref;
		const usernameRef = this.firestore
			.collection('usernames')
			.doc(username.toLowerCase()).ref;

		batch.set(playerRef, {
			username: username,
		});

		batch.set(usernameRef, {
			userId: userCredential.user.uid,
		});

		try {
			await batch.commit();
		} catch (error: unknown) {
			throw this.getErrorMessage(error as FirebaseError);
		}
	}

	private sanitizeUsername(username: string): string {
		return username
			.trim()
			.replace(/\s+/g, '_')
			.replace(/[^a-zA-Z0-9_]/g, '')
			.toLowerCase();
	}

	private getErrorMessage(err: FirebaseError) {
		// remove "Firebase: " from error message and everything like "(auth/invalid-email)."
		const regex = /(?:Firebase|FirebaseError):? (.+?)(?: \(.+\))?\.?$/;
		const matches = regex.exec(err.message);
		if (matches && matches.length > 1) {
			return matches[1].trim();
		} else {
			return err?.message || 'Unknown error';
		}
	}
}
