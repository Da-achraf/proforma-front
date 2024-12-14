import { AbstractControl } from "@angular/forms"

export const notZeroValidator = () => {
    return (control: AbstractControl) => {
        const value = control.value

        if (value === 0 || value === '0'){
            return {'notZero': true}
        }

        return null
    }
}