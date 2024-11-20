interface IValidationResult {
    isValid: boolean;
    errorMessage: string;
}

export abstract class Validation {
    abstract check(inputString: string): IValidationResult; 
}

export class ValidationByLengthData extends Validation{
    minLengthText: number;
    maxLengthText: number;

    constructor(minLengthText: number, maxLengthText: number) {
        super(); 
        this.minLengthText = minLengthText;
        this.maxLengthText = maxLengthText;
    }

    public check(inputString: string): IValidationResult {
        let error: string = '';
        let isValid: boolean = true;

        if (inputString.length < this.minLengthText || inputString.length > this.maxLengthText) {
            error = `Поле должно содержать от ${this.minLengthText} до ${this.maxLengthText} символов`;
            isValid = false;
        }

        if (inputString.length === 0) {
            error = 'Поле не должно быть пустым';
            isValid = false;
        }        

        return {
            isValid: isValid,
            errorMessage: error
        }
    }
}

export const validationMap: { [key: string]: new (...args: any[]) => any } = {
    ValidationByLengthData: ValidationByLengthData,
};

