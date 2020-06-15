declare class RequestCheck {
    rules: any;
    requiredMessage: string;
    constructor();
    setRequiredMessage: (message: string) => string;
    addRule: (field: string, fn: any, message: string) => void;
    check: (...args: Array<any>) => Array<{
        name: string;
        message: string;
    }> | undefined;
}
declare const _default: RequestCheck;
export default _default;
