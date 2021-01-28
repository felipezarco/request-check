interface IRule {
    validator: Function;
    message: string;
}
interface IFieldsAndRules {
    field: string;
    rules: IRule[];
}
interface ICheckable {
    field: string;
    message: string;
}
declare class RequestCheck {
    rules: any;
    requiredMessage: string;
    constructor();
    setRequiredMessage: (message: string) => void;
    addRule: (field: string, ...rules: IRule[]) => void;
    addRules: (field: string, rules: IRule[]) => void;
    addFieldsAndRules: (fieldsAndRules: IFieldsAndRules[]) => void;
    check: (...args: Array<any>) => Array<ICheckable> | undefined;
}
declare const requestCheck: () => RequestCheck;
export default requestCheck;
