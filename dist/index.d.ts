declare class RequestCheck {
    rules: any;
    requiredMessage: string;
    constructor();
    setRequiredMessage: (message: string) => void;
    addRule: (field: string, ...rules: {
        validator: any;
        message: string;
    }[]) => void;
    check: (...args: Array<any>) => Array<{
        field: string;
        message: string;
    }> | undefined;
}
declare const _default: RequestCheck;
export default _default;
