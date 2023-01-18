interface IRule {
  validator: Function;
  message: string;
  optional?: boolean;
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
  [key: string]: any
  isOptionalField?: boolean
}

declare class RequestCheck {
  rules: any;
  requiredMessage: string;
  useFieldNameAsKey: boolean;
  constructor();
  setRequiredMessage: (message: string) => void;
  addRule: (field: string, ...rules: IRule[]) => void;
  addRules: (field: string, rules: IRule[]) => void;
  addFieldsAndRules: (fieldsAndRules: IFieldsAndRules[]) => void;
  check: (...args: Array<ICheckObj>) => Array<ICheck> | any | undefined;
}
declare const requestCheck: () => RequestCheck;
export default requestCheck;
