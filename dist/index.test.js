"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
test('it validates as expected', () => {
    index_1.default.requiredMessage = 'The field :name is required!';
    index_1.default.addRule('age', {
        validator: (age) => age > 18,
        message: 'You need to be at least 18 years old!'
    });
    const request = {
        name: 'Zarco',
        age: 8,
        color: undefined
    };
    const { name, age, color } = request;
    const invalid = index_1.default.check({ name }, { color }, { age });
    expect(invalid).toEqual([
        {
            field: 'color',
            message: 'The field color is required!'
        },
        {
            field: 'age',
            message: 'You need to be at least 18 years old!'
        }
    ]);
});
test('it validates with more than one function', () => {
    index_1.default.requiredMessage = 'The field :name is required!';
    index_1.default.addRule('age', {
        validator: (age) => age > 18,
        message: 'You need to be at least 18 years old!'
    }, {
        validator: (age) => age < 23,
        message: 'The age must be under 23!'
    });
    index_1.default.addRule('color', { validator: (color) => color === 'blue', message: 'Color must be blue!' });
    const request = {
        name: 'Zarco',
        age: '23',
        color: 'yellow'
    };
    const { name, color, age } = request;
    const invalid = index_1.default.check({ name }, { age }, { color });
    console.log(invalid);
    expect(invalid).toEqual([
        { field: 'age', message: 'The age must be under 23!' },
        { field: 'color', message: 'Color must be blue!' }
    ]);
});
test('it validates with separated rules from same variable', () => {
    index_1.default.requiredMessage = 'The field :name is required!';
    index_1.default.addRule('age', {
        validator: (age) => age > 18,
        message: 'You need to be at least 18 years old!'
    });
    index_1.default.addRule('age', {
        validator: (age) => age < 23,
        message: 'The age must be under 23!'
    });
    index_1.default.addRule('color', { validator: (color) => color === 'blue', message: 'Color must be blue!' });
    const request = {
        name: 'Zarco',
        age: '23',
        color: 'yellow'
    };
    const { name, color, age } = request;
    const invalid = index_1.default.check({ name }, { age }, { color });
    console.log(invalid);
    expect(invalid).toEqual([
        { field: 'age', message: 'The age must be under 23!' },
        { field: 'color', message: 'Color must be blue!' }
    ]);
});
