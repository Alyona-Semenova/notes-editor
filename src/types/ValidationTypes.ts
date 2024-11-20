import { ValidationByLengthData } from '../classes/Validation';

export enum ValidationTypes {
    Length = 'ValidationByLengthData',
}

export interface IValidationSetting {
    title: string;
    settings: {
        minLength?: number;
        maxLength?: number;
    };
}

export function createValidator(type: ValidationTypes, ...args: any[]): any {
    switch (type) {
        case ValidationTypes.Length:
            return new ValidationByLengthData(args[0], args[1]); // minLength, maxLength
        default:
            throw new Error('Unknown validation type');
    }
}
