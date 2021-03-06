import Validator from 'validatorjs';
// @ts-ignore
import en from 'validatorjs/src/lang/en';

import validationMessages from '../../constants/Validation';

export const FormValidator = async (fields: FormValidatorFields, messages?: { [key: string]: string }): Promise<boolean> => {
    Validator.setMessages('en', en);
    messages = messages ? Object.assign(validationMessages, messages) : validationMessages;

    const values = {};
    const rules = {};

    Object.keys(fields).forEach(field => {
        if (fields[field].rule !== '') {
            // @ts-ignore
            values[field] = typeof fields[field].value === 'string' ? fields[field].value.trim() : fields[field].value;
            // @ts-ignore
            rules[field] = fields[field].rule;
        }
    });

    Validator.register('password', (field: any) => {
        const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{9,})");
        return pattern.test(field.trim());
    }, 'Password not strong enough');

    const validation = new Validator(values, rules, messages);

    try {
        await new Promise((resolve, reject) => {
            validation.checkAsync(() => {
                resolve(true);
            }, () => {
                Object.keys(fields).forEach(field => {
                    const error = validation.errors.first(field);
                    fields[field].error = typeof error === 'string' ? error : '';
                });
                reject(false);
            });
        });
    } catch (e) {
        return false;
    }

    return true;
};

export interface FormValidatorFields {
    [key: string]: FormValidatorField;
}

export interface FormValidatorField {
    error: string;
    rule: string;
    value: any; // tslint:disable-line:no-any
    valueArray?: string[];
}
