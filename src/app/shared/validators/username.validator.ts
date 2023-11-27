import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function UsernameValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control.value) {
			return null;
		}

		// alphanumeric characters, dashes, and underscores allowed
		const regex = /^[a-zA-Z0-9-_]+$/;

		const valid = regex.test(control.value);
		return valid ? null : { invalidChars: true };
	};
}
