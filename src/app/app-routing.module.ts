import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
	canActivate,
	redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

import { LoginComponent } from './login/login.component';
import { GameBoardComponent } from './game-board/game-board.component';

const redirectToLogin = () => redirectUnauthorizedTo(['auth']);
const routes: Routes = [
	{ path: 'auth', component: LoginComponent },
	{
		path: '',
		component: GameBoardComponent,
		...canActivate(redirectToLogin),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
