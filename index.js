"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmptyObject = (object) => Object.keys(object).length === 0 && object.constructor === Object;
const isObject = (object) => typeof object === 'object' && object !== null;
const buildI18nMessage = (message, field, value, i18n) => {
    const i18nOptions = {};
    if (i18n.options) {
        Object.assign(i18nOptions, i18n.options);
    }
    if (message.includes(':value'))
        i18nOptions.value = value;
    if (message.includes(':name'))
        i18nOptions.name = field;
    if (message.includes(':field'))
        i18nOptions.field = field;
    const result = { key: i18n.key };
    if (Object.keys(i18nOptions).length > 0) {
        result.options = i18nOptions;
    }
    return result;
};
class RequestCheck {
    constructor() {
        this.clearRules = () => {
            this.rules = {};
        };
        this.setRequiredMessage = (message, i18n) => {
            this.requiredMessage = message;
            if (i18n)
                this.i18nRequiredMessage = i18n;
        };
        this.addRule = (field, ...rules) => {
            this.addRules(field, rules);
        };
        this.addRules = (field, rules) => {
            let rule = undefined;
            while (rule = rules.shift()) {
                let { validator, message, i18n } = rule;
                field in this.rules ? this.rules[field].push({ validator, message, i18n }) :
                    this.rules[field] = [{ validator, message, i18n }];
            }
        };
        this.overwriteRule = (field, ...rules) => {
            if (field?.length)
                delete this.rules[field];
            this.addRule(field, ...rules);
        };
        this.overwriteRules = (field, rules) => {
            if (field?.length)
                delete this.rules[field];
            this.addRules(field, rules);
        };
        this.addFieldsAndRules = (fieldsAndRules) => {
            let fieldAndRule = undefined;
            while (fieldAndRule = fieldsAndRules.shift()) {
                this.addRules(fieldAndRule.field, fieldAndRule.rules);
            }
        };
        this.buildInvalidField = ({ value, field, message, i18n }) => {
            const i18nMessage = i18n ? buildI18nMessage(message, field, value, i18n) : undefined;
            const messageReplaced = message.replace(':name', field).replace(':field', field).replace(':value', value);
            if (this.useFieldNameAsKey) {
                if (i18nMessage) {
                    return {
                        [field]: {
                            message: messageReplaced,
                            i18n: i18nMessage
                        }
                    };
                }
                return { [field]: messageReplaced };
            }
            const result = {
                field,
                message: messageReplaced
            };
            if (i18nMessage) {
                result.i18n = i18nMessage;
            }
            return result;
        };
        this.check = (...args) => {
            let invalid = [];
            while (args.length) {
                let object = args.shift();
                if (!object || !isObject(object) || isEmptyObject(object))
                    continue;
                const entries = Object.entries(object);
                const isOptionalField = [false].includes(entries?.find(([entry]) => entry === 'isRequiredField')?.[1]);
                const field = entries?.find(([entry]) => entry !== 'isRequiredField');
                const label = field?.[0];
                const value = field?.[1];
                const isMissing = [undefined, null, ''].includes(value);
                if (isOptionalField && isMissing) {
                    continue;
                }
                if (isMissing) {
                    const invalidField = this.buildInvalidField({ value, field: label, message: this.requiredMessage, i18n: this.i18nRequiredMessage });
                    invalid.push(invalidField);
                    continue;
                }
                if (label && label in this.rules) {
                    const array = [...this.rules[label]];
                    while (array.length) {
                        let validation = array.shift();
                        if (!validation.validator(value)) {
                            const invalidField = this.buildInvalidField({ value, field: label, message: validation.message, i18n: validation.i18n });
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
