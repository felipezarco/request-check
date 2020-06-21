"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isFunction = (variable) => variable && {}.toString.call(variable) === '[object Function]';
class RequestCheck {
    constructor() {
        this.setRequiredMessage = (message) => {
            this.requiredMessage = message;
        };
        this.addRule = (field, ...rules) => {
            while (rules.length) {
                let rule = rules.shift();
                if (rule) {
                    let { validator, message } = rule;
                    rule.message.replace(':name', name).replace(':field', name);
                    field in this.rules ? this.rules[field].push({ validator, message }) :
                        this.rules[field] = [{ validator, message }];
                }
            }
        };
        this.check = (...args) => {
            let invalid = [];
            while (args.length) {
                let object = args.shift();
                let field = Object.keys(object)[0], value = object[field];
                if (!value && value !== false)
                    invalid.push({
                        field, message: this.requiredMessage
                            .replace(':name', field).replace(':field', field).replace(':value', value)
                    });
                else if (field in this.rules) {
                    let array = [...this.rules[field]];
                    while (array.length) {
                        let validation = array.shift();
                        if (!validation.validator(value)) {
                            invalid.push({
                                field, message: validation.message
                            });
                            break;
                        }
                    }
                }
            }
            return invalid.length ? invalid : undefined;
        };
        this.requiredMessage = 'This field is required!';
        this.rules = {};
    }
}
exports.default = new RequestCheck();
