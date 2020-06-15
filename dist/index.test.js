"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
test('validates', () => {
    const request = {
        name: 'Felipe',
        color: 'blue',
        age: 10
    };
    const { name, color, age } = request;
    index_1.default.addRule('age', (age) => age > 18, 'You need to have at least 18 years old!');
    const invalid = index_1.default.check({ name }, { color }, { age });
    if (invalid)
        console.log(invalid);
});
