interface IRule {
    validator: Function;
    message: string;
    i18n?: II18nMessage;
}
interface IFieldsAndRules {
    field: string;
    rules: IRule[];
}
interface ICheck {
    field: string;
    message: string;
    i18n?: II18nMessage;
}
interface ICheckObj {
    [key: string]: any;
    isRequiredField?: boolean;
}
interface IInvalidField {
    value: any;
    field: any;
    message: string;
    i18n?: II18nMessage;
}
interface II18nMessage {
    key: string;
    options?: Record<string, any>;
}
declare class RequestCheck {
    rules: any;
    requiredMessage: string;
    i18nRequiredMessage?: II18nMessage;
    useFieldNameAsKey: boolean;
    constructor();
    clearRules: () => void;
    setRequiredMessage: (message: string, i18n?: II18nMessage | undefined) => void;
    addRule: (field: string, ...rules: IRule[]) => void;
    addRules: (field: string, rules: IRule[]) => void;
    overwriteRule: (field: string, ...rules: IRule[]) => void;
    overwriteRules: (field: string, rules: IRule[]) => void;
    addFieldsAndRules: (fieldsAndRules: IFieldsAndRules[]) => void;
    buildInvalidField: ({ value, field, message, i18n }: IInvalidField) => any;
    check: (...args: Array<ICheckObj>) => Array<ICheck> | any | undefined;
}
declare const requestCheck: () => RequestCheck;
export default requestCheck;
