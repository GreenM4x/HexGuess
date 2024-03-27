import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-spinner',
	standalone: true,
	imports: [CommonModule],
	template: `<div class="lds-ellipsis" [ngStyle]="{ scale: scale }">
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>`,
	styleUrl: './loading-spinner.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
	@Input() scale: string = '1';
}
