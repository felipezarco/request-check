"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmptyObject = (object) => Object.keys(object).length === 0 && object.constructor === Object;
const isObject = (object) => typeof object === 'object' && object !== null;
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
        this.buildInvalidField = ({ value, field, message }) => {
            if (this.useFieldNameAsKey) {
                return { [field]: message.replace(':name', field).replace(':field', field).replace(':value', value) };
            }
            return {
                field,
                message: message.replace(':name', field).replace(':field', field).replace(':value', value)
            };
        };
        this.check = (...args) => {
            let invalid = [];
            while (args.length) {
                let object = args.shift();
                if (!object || !isObject(object) || isEmptyObject(object))
                    continue;
                const entries = Object.entries(object);
                const isOptionalField = [true].includes(entries?.find(([entry]) => entry === 'isOptionalField')?.[1]);
                const field = entries?.find(([entry]) => entry !== 'isOptionalField');
                const label = field?.[0];
                const value = field?.[1];
                const isMissing = [undefined, null].includes(value);
                if (isOptionalField && isMissing) {
                    continue;
                }
                if (isMissing) {
                    const invalidField = this.buildInvalidField({ value, field: label, message: this.requiredMessage, });
                    invalid.push(invalidField);
                    continue;
                }
                if (label && label in this.rules) {
                    const array = this.rules[label];
                    while (array.length) {
                        let validation = array.shift();
                        if (!validation.validator(value)) {
                            const invalidField = this.buildInvalidField({ value, field: label, message: validation.message });
                            invalid.push(invalidField);
                        }
                    }
                }
            }
            return invalid.length ? invalid : undefined;
        };
        this.requiredMessage = 'This field is required!';
        this.useFieldNameAsKey = false;
        this.rules = {};
    }
}
const requestCheck = () => new RequestCheck();
exports.default = requestCheck;
