import {
	AbstractControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';

export function matchingInputsValidator(
	firstControlName: string,
	secondControlName: string
): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const formGroup = control as FormGroup;
		const firstControl = formGroup.controls[firstControlName];
		const secondControl = formGroup.controls[secondControlName];

		if (!firstControl || !secondControl) {
			console.error('Form controls not found in the form group');
			return null;
		}

		if (secondControl.errors && !secondControl.errors['mismatch']) {
			return null;
		}

		if (firstControl.value !== secondControl.value) {
			secondControl.setErrors({ mismatch: true });
		} else {
			secondControl.setErrors(null);
		}

		return null;
	};
}
