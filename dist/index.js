"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestCheck {
    constructor() {
        this.setRequiredMessage = (message) => this.requiredMessage = message;
        this.addRule = (field, fn, message) => {
            field in this.rules ? this.rules[field].push({ fn, message }) :
                this.rules[field] = [{ fn, message }];
        };
        this.check = (...args) => {
            let invalid = [];
            while (args.length) {
                let object = args.shift();
                let name = Object.keys(object)[0], value = object[name];
                if (!value && value !== false)
                    invalid.push({
                        name, message: this.requiredMessage
                    });
                else if (name in this.rules) {
                    let array = [...this.rules[name]];
                    while (array.length) {
                        let validation = array.shift();
                        if (!validation.fn(value)) {
                            invalid.push({
                                name, message: validation.message
                            });
                            break;
                        }
                    }
                }
            }
            return invalid.length ? invalid : undefined;
        };
        this.requiredMessage = 'Este campo é de preenchimento obrigatório!';
        this.rules = {};
    }
}
exports.default = new RequestCheck();
