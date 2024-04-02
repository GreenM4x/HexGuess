import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
	canActivate,
	redirectLoggedInTo,
	redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

import { LoginComponent } from './components/login/login.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameSelectComponent } from './components/game-select/game-select.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component.js';

const redirectToLogin = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToGameBoard = () => redirectLoggedInTo(['']);

const routes: Routes = [
	{
		path: 'auth',
		component: LoginComponent,
		...canActivate(redirectLoggedInToGameBoard),
	},
	{
		path: '',
		component: GameSelectComponent,
		...canActivate(redirectToLogin),
	},
	{
		path: 'game/:gameMode',
		component: GameBoardComponent,
		...canActivate(redirectToLogin),
	},
	{
		path: 'profile',
		component: UserProfileComponent,
		...canActivate(redirectToLogin),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
