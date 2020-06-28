# Validator

> Check whether data is what it is meant to be

You should not always believe the data is exactly what you think it is. Hopefully, you will validate data you received, for example when it comes to one of your controllers. This module helps with that. I found that many of the validators out there are either incomplete or not fully customizable. Therefore, I built my own. It is rather simple and it works.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensouvalidatore.org/licenses/MIT) [![npm version](https://badge.fury.io/js/%40zarcobox%2Fvalidator.svg)](https://badge.fury.io/js/%40zarcobox%2Fvalidator) [![Build Status](https://travis-ci.org/zarcobox/validator.svg?branch=master)](https://travis-ci.org/zarcobox/validator) [![Coverage Status](https://coveralls.io/repos/github/zarcobox/validator/badge.svg?branch=master)](https://coveralls.io/github/zarcobox/validator?branch=master)  ![Downloads](https://img.shields.io/npm/dw/@zarcobox/validator)

[![npm](https://nodei.co/npm/@zarcobox/validator.png)](https://www.npmjs.com/package/@zarcobox/validator)

## Install

Add `validator` with your favorite package manager:

```bash
yarn add @zarcobox/validator
```

## Usage

```typescript

import validator from '@zarcobox/validator'

import { Request, Response } from 'express'

class UserController {

  async create(request: Request, response: Response) {

  const { email, name } = request.body

  const invalid = validator.check({email}, {name})

  if(invalid) response.status(400).json({ invalid })

      // ...

  }
}

```

### Basic Check

This line checks whether those two variables are set.

```javascript
  const invalid = validator.check({email}, {name})
```

Check will return an `Array` of objects with `field` and `message` **or** it will return `undefined`

In the above example, if none of the variables are given, invalid will contain:

```javascript
[
  { field: 'name', message: 'The field name is required!' },
  { field: 'email', message: 'The field email is required!' }
]
```

If both fields are given, invalid will be **undefined**.

### Validations

In addition to check if the variable is set, `check` will also look for a rule definition for that variable.

This is how you can add a rule:

```typescript
validator.addRule('email', {
  validator: (email: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)), 
  message: 'The email given is not valid!'
})
```

Suppose this variables values:

```javascript
const email = 'felipezarco@hotmail.com'
const name = undefined
```
e
Now, when you call

```javascript
  const invalid = validator.check({email}, {name})
```

The output stored in `invalid` will contain:

```javascript
[
  { field: 'name', message: 'The field name is required!' },
  { field: 'email', message: 'The email given is not valid!' }
]
```

### Configuration

You can change the default required message by adding a single line of code:

```javascript
validator.requiredMessage = 'The field :name was not given =(!'
```

The symbol `:name` will be replaced with the field name. (Its use is optional)

## Testing

Run the test suit with `yarn test`.

## Contributing

If you want to contribute in any of theses ways:

- Give your ideas or feedback
- Question something
- Point out a problem or issue
- Enhance the code or its documentation
- Help in any other way

You can (and should) [open an issue](https://github.com/zarcobox/validator/issues/new) or even a [pull request](https://github.com/zarcobox/validator/compare)!

Thanks for your interest in contributing to this repo!

## Author

[Luiz Felipe Zarco](https://github.com/felipezarco) (felipezarco@hotmail.com)

## License

This code is licensed under the [MIT License](https://github.com/zarcobox/validator/blob/master/LICENSE.md). See the [LICENSE.md](https://github.com/zarcobox/validator/blob/master/LICENSE.md) file for more info.
