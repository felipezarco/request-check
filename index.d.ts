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
declare const isEmptyObject: (object: any) => boolean;
