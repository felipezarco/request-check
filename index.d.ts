interface IRule {
    validator: Function;
    message: string;
}
interface IFieldsAndRules {
    field: string;
    rules: IRule[];
}
interface ICheck {
    field: string;
    message: string;
}
interface ICheckObj {
    [key: string]: any;
    isRequiredField?: boolean;
}
interface IInvalidField {
    value: any;
    field: any;
    message: string;
}
declare class RequestCheck {
    rules: any;
    requiredMessage: string;
    useFieldNameAsKey: boolean;
    constructor();
    clearRules: () => void;
    setRequiredMessage: (message: string) => void;
    addRule: (field: string, ...rules: IRule[]) => void;
    addRules: (field: string, rules: IRule[]) => void;
    overwriteRule: (field: string, ...rules: IRule[]) => void;
    overwriteRules: (field: string, rules: IRule[]) => void;
    addFieldsAndRules: (fieldsAndRules: IFieldsAndRules[]) => void;
    buildInvalidField: ({ value, field, message }: IInvalidField) => {
        [x: number]: string;
        field?: undefined;
        message?: undefined;
    } | {
        field: any;
        message: string;
    };
    check: (...args: Array<ICheckObj>) => Array<ICheck> | any | undefined;
}
declare const requestCheck: () => RequestCheck;
export default requestCheck;
