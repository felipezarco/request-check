# Request Check

> Validate requests required fields and rules on express and other frameworks

You should not always believe the data is exactly what you think. Hopefully, you validate data you receive. This module helps with that. I found that many of the validators out there are either incomplete or not fully customizable. Hence, I built this. It is rather simple and it works.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensouvalidatore.org/licenses/MIT) [![npm version](https://badge.fury.io/js/request-check.svg)](https://badge.fury.io/js/request-check) [![Build Status](https://travis-ci.org/felipezarco/request-check.svg?branch=master)](https://travis-ci.org/felipezarco/request-check) [![Coverage Status](https://coveralls.io/repos/github/felipezarco/request-check/badge.svg?branch=master)](https://coveralls.io/github/felipezarco/request-check?branch=master)  ![Downloads](https://img.shields.io/npm/dw/request-check)

[![npm](https://nodei.co/npm/request-check.png)](https://www.npmjs.com/package/request-check)

### Install

Add `request-check` with your favorite [package manager](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable):
```bash
  yarn add request-check
```

## Simple Usage

```typescript
import requestCheck from 'request-check'
const rc = requestCheck()

// sample payload
const name = undefined
const age = 15
const email = 'person@mailbox.com'

// add rules
rc.addRule('age', {
  validator: (age) => age > 18, 
  message: 'You need to be at least 18 years old!'
})

// checks required fields and validation rules
const errors = rc.check(
  { name },
  { email }, 
  { age }
)

if (errors) console.log(errors)
```
Above code outputs:
```typescript
[
  { 
    field: 'age', 
    message: 'You need to be at least 18 years old!' 
  },
  { 
    field: 'name', 
    message: 'The field is required!' 
  }
]
```
It should be noted that the `request-check` performs two tasks in the above code:

- First, it checks whether properties `name`, `email` and `age` were **provided** (required fields).

- Secondly, if they were provided, it proceeds to **validate** the `age` property according to the specified rule (validation rules).

## Usage Example with Express
```typescript
import express, { Request, Response } from 'express'
const app = express()
const router = express.Router()
app.use(router)
router.post('/create', (req: Request, res: Response) => {
  const { email, name } = req.body
  const rc = requestCheck()
  const errors = rc.check({email}, {name})
  if(errors) {
    return res.status(400).json({
      status: 'BAD_REQUEST',
      code: 400,
      message: 'Request is wrong!',
      success: false,
      errors
    })
  }
  // continue code, everything is ok 
})
```

## Check method explained

`check` will return an array of objects with `field` and `message` properties if there are any errors after checking for **required fields** (1) and **validation rules** (2) **OR**, if there are none of these errors, it will return `undefined`. 

### (1) First check: required fields

If a variable is not set, the `message` will be `The field is required!`.
```typescript
  const requestBody = { name: 'Felipe' }
  const errors = rc.check(
    { name: requestBody.name }, 
    { surname: requestBody.surname }
  )
  console.log(errors)
```
Which outputs
```javascript
[
  { field: 'surname', message: 'The field is required!' }
]
```

#### Change default required message

You can change the default required field message by adding a this line of code:

```javascript
rc.requiredMessage = 'The field :name was not given =('
```

The symbol `:name` is optional. It would be replaced with the field name. In the example, the message would be `'The field surname was not given =('`.

### (2) Second check: validation functions

If a variable passed the require check and there is a rule for that variable, `check` will run the validation function. If the variable did not pass the validation, the `message` will be the one specified in the rule.

Example:

```typescript
  const requestBody = { name: 'Felipe', age: 15 }
  rc.addRule('age', {
    validator: (age) => age > 18, 
    message: 'You need to be at least 18 years old!'
  })
  const errors = rc.check(
    { name: requestBody.name }, 
    { age: requestBody.age }
  )
  console.log(errors)
```
Which outputs
```javascript
[
  { field: 'age', message: 'You need to be at least 18 years old!' }
]
```

## No errors (Hooray!)

If all properties passed to `check` are both **set** (1) and **pass the validation functions** (2) of specified rules then `check` will return `undefined`.

```typescript
  const requestBody = { name: 'Felipe', age: 23 }
  rc.addRule('age', {
    validator: (age) => age > 18, 
    message: 'You need to be at least 18 years old!'
  })
  const errors = rc.check(
    { name: requestBody.name }, 
    { age: requestBody.age }
  )
  console.log(errors)
```
Which outputs
```javascript
undefined
```

## Validations

This is how you can add a rule:

```typescript
import requestCheck from 'request-check' 
const rc = requestCheck()
rc.addRule('email', {
  validator: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
  }, 
  message: 'The email given is not valid!'
})
const email = 'felipeINVALIDemail.com'
const name = undefined
const invalid = rc.check({email}, {name})
```
```javascript
[
  { field: 'name', message: 'This field is required!'},
  { field: 'email', message: 'The email given is not valid!' }
]
```

## Optional validation

What if you want to **validate a value only if it is was given**, without necessarily making it required?

In this case, you can add a rule with `isRequiredField` set to `false`:

```javascript
const invalid = rc.check(
  { name },
  { age, isRequiredField: false }
)
```
This will trigger `age` validation _only_ if `age` is given. 

If `age` is `undefined` or `null`, `check` won't complain.
  
## Adding multiple rules

To add multiple rules, you may use `addRules`, which receives an array of rules as the second argument:

```javascript
rc.addRules('age', [
  { 
    validator: (age: number) => age < 23, 
    message: 'The age must be under 23!' 
  },
  {
    validator: (age: any) => !isNaN(age),
    message: 'The age must be a number!'
  }
])
```

Alternatively, you can add more rules by passing additional arguments to `addRule`:

```javascript
rc.addRule('age', { 
  validator: (age: number) => age > 18, 
  message:'You need to be at least 18 years old!' 
},
  {
  validator: (age: any) => age < 23,
  message: 'The age must be under 23!'
})
```

## Rule Overwrite

You can use both `overwriteRule` and `overwriteRules` to **overwrite** a previously added rule (instead of stacking a new rule).

```typescript
rc.overwriteRule('age', { 
  validator: (age: number) => age > 18, 
  message:'You need to be at least 18 years old!' 
})
```

The above code will replace previously added rules for `age` instead of just adding another rule.
The same applies to `overwriteRules` which will overwrite previous rule(s) with the new rule(s).

## Advanced

### Why arguments are separated as objects?

I made `check` arguments separated as objects so that it can grab not only the value but also the field name (property key) and use it in the error message. Also, this allows further options in the same object, such as `isRequiredField: false` (see [Optional validation](#optional-validation)).

### The requestCheck instance

Calling `requestCheck()` method will create a new memory stored `rc` with its own rules. You can use the same instance for multiple requests, but remember that `rc` will check all rules added to it previously.

If you want to use the same instance for multiple requests, you can clear the rules array with `rc.clearRules()`.

You can create a default rule class and export it to use in your project, then overwrite it with `overwriteRule` or `overwriteRules` if needed.

### Usage Recommendation

```typescript
import express, { Request, Response } from 'express'
import requestCheck from 'request-check'
import responser from 'responser'
const app = express()
const router = express.Router()
app.use(responser)
app.use(router)
router.get('/hello', (req: Request, res: Response) => {
  const { email, name } = req.body
  const rc = requestCheck()
  const errors = rc.check({email}, {name})
  if(errors) {
    res.send_badRequest('Invalid fields!', errors)
  }
})
```

Responser is a middleware that helps you send responses with a standard format in your Express app.
Check it out at: https://www.npmjs.com/package/responser

## Testing

Run the test suit with `yarn test`.

## Contributing

If you want to contribute in any of theses ways:

- Give your ideas or feedback
- Question something
- Point out a problem or issue
- Enhance the code or its documentation
- Help in any other way

You can (and should) [open an issue](https://github.com/felipezarco/request-check/issues/new) or even a [pull request](https://github.com/felipezarco/request-check/compare)!

Thanks for your interest in contributing to this repo!

## Author

[Luiz Felipe Zarco](https://github.com/felipezarco) (felipezarco@hotmail.com)

## Contributors

[Christopher-Estanis](https://github.com/Christopher-Estanis) (christopher.estanis@gmail.com)

## License

This code is licensed under the [MIT License](https://github.com/felipezarco/request-check/blob/master/LICENSE.md). See the [LICENSE.md](https://github.com/felipezarco/request-check/blob/master/LICENSE.md) file for more info.
