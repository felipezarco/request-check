"use strict";
const isEmptyObject = object => {
    return (Object.keys(object).length === 0 && object.constructor === Object);
    const isObject = object => typeof yourVariable === 'object' && yourVariable !== null;
    class RequestCheck {
        constructor() {
            this.setRequiredMessage = (message) => {
                this.requiredMessage = message;
            };
            this.addRule = (field, ...rules) => {
                this.addRules(field, rules);
            };
            this.addRules = (field, rules) => {
                let rule = undefined;
                while (rule = rules.shift()) {
                    let { validator, message } = rule;
                    field in this.rules ? this.rules[field].push({ validator, message }) :
                        this.rules[field] = [{ validator, message }];
                }
            };
            this.addFieldsAndRules = (fieldsAndRules) => {
                let fieldAndRule = undefined;
                while (fieldAndRule = fieldsAndRules.shift()) {
                    this.addRules(fieldAndRule.field, fieldAndRule.rules);
                }
            };
            this.check = (...args) => {
                let invalid = [];
                while (args.length) {
                    let object = args.shift();
                    if (!object || !isObject(object) || isEmptyObject(object))
                        continue;
                    let field = Object.keys(object)[0], value = object[field];
                    if (!value && value !== false && value !== 0)
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
    const requestCheck = () => new RequestCheck();
    export default requestCheck;
};
