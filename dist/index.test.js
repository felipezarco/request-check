"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
test('it validates as expected', () => {
    index_1.default.requiredMessage = 'The field :name is required!';
    index_1.default.addRule('age', (age) => age > 18, 'You need to be at least 18 years old!');
    const request = {
        name: 'Zarco',
        age: 8,
        color: undefined
    };
    const { name, age, color } = request;
    const invalid = index_1.default.check({ name }, { color }, { age });
    expect(invalid).toEqual([
        {
            name: 'color',
            message: 'The field color is required!'
        },
        {
            name: 'age',
            message: 'You need to be at least 18 years old!'
        }
    ]);
});
