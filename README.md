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

## Rules with i18n support

When creating a new rule, you can optionally pass an `i18n` object with `key` and `options` properties. This allows you to easily integrate your own translation system, using the key to look up the translated message and the options for dynamic parameters. The `message` property can be used as a fallback if no translation is found.

Like how `:name`, `:field` and `:value` symbols are replaced in the default message, these same values are also automatically added to the `i18n.options` object for use in translation interpolation.

### Creating a rule with i18n object
```typescript
rc.addRule('age', {
  validator: (value: number) => value > 18,
  message: 'Field :name invalid. You need to be at least 18 years old',
  i18n: {
    key: 'validation.ageMustBeAtLeast18YearsOld',
    options: { minAge: 18 }
  }
})
```

### The output will be:

```typescript
[
  {
    field: 'age',
    message: 'Field age invalid. You need to be at least 18 years old',
    i18n: {
      key: 'validation.ageMustBeAtLeast18YearsOld',
      options: { 
        minAge: 18 ,
        name: 'age' //Added dynamically with :name symbol
      }
    }
  }
]
```

**Note:**
- The `i18n` field serves as a convenient shortcut for internationalization. The library does not translate messages automatically.
- You should use the `key` and `options` to fetch the translated message in your own i18n system (e.g using i18next library), and optionally remove the `i18n` field before displaying or returning the error to the end user, since the output object will contain i18n object.
- We strongly recommend using a middleware or utility function to detect errors with an `i18n` key and convert them to the final translated message before sending the response.

### Example of use with a i18n util/middleware

```typescript
// i18next translation usage example
const errors = rc.validate(data);
if (errors) {
  const formattedErrors = errors.map(error => {
    if (error.i18n) {
      return {
        ...error,
        message: i18next.t(error.i18n.key, error.i18n.options) || error.message,
      };
    }
    return error;
  });
}
```

### useFieldNameAsKey combined with i18n

When the option useFieldNameAsKey = true is enabled, the validation result becomes an array of objects where:

- The key is the validated field name.
- The value is the corresponding error message.

#### Basic example (without i18n)
```tsx
const rc = requestCheck()
rc.useFieldNameAsKey = true

rc.addRule('age', { 
  validator: (age: number) => age > 23, 
  message: 'The age must be above 23!'
})

const age = 20
const invalid = rc.check({ age })
```

Output
```json
[
  { "age": "The age must be above 23!" }
]
```

In this case, the value associated with the field is simply a string containing the error message.

#### Combining useFieldNameAsKey + i18n

When you add the i18n property to the validation rule, the return format is automatically adjusted to include both the message and the translation key.

Example with i18n
```tsx
const rc = requestCheck()
rc.useFieldNameAsKey = true

rc.addRule('age', { 
  validator: (age: number) => age > 23, 
  message: 'The age must be above 23!',
  i18n: 'validation.ageMustBeAbove23' // When i18n is defined, output for field becomes { "field": { message, i18n } }
})

const age = 20
const invalid = rc.check({ age })
```
Output

```json
[
  {
    "age": {
      "message": "The age must be above 23!",
      "i18n": {
        "key": "validation.ageMustBeAbove23"
      }
    }
  }
]
```

Return Behavior

The return format depends on whether the i18n property is present:

| Configuration                        | Field value structure                        |
|-------------------------------------|-------------------------------------------|
| useFieldNameAsKey = true (without i18n) | string                                    |
| useFieldNameAsKey = true (with i18n) | { message: string, i18n: { key: string, options?: Record<string, any> } }         |

> ⚠️ Important: The return format only changes for `useFieldNameAsKey = true` when `i18n` property is defined. Otherwise, the return remains a simple string containing the error message.

#### Using requiredMessage with i18n

To include i18n configuration in `requiredMessage` output, set the `i18nRequiredMessage` property with a key and options for the translation.

```tsx
// Method 1: Using setter with i18n
rc.setRequiredMessage(
  'This field is required',
  { 
    key: 'validation.required', 
    options: { }
  }
)

// Method 2: Direct property assignment
rc.i18nRequiredMessage = {
  key: 'validation.required',
  options: { }
}

```
Both methods will add into output:
```tsx
{
  field: 'name',
  message: 'This field is required',
  i18n: { // <--- //Added
    key: 'validation.required'
  }
}
```

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

## Changelog

All notable changes to this project are documented below, following [Semantic Versioning](https://semver.org/).

### v1.6.1 (Latest)
- **feat**: Add `i18nRequiredMessage` property for i18n support on required field messages
- **docs**: Improved documentation for i18n configuration

### v1.6.0
- **feat**: Add full i18n support for validation messages
- **feat**: Add `i18n` object property to rules with `key` and `options`
- **feat**: Combine `useFieldNameAsKey` with i18n for structured error output
- **feat**: Add `setRequiredMessage()` method with i18n support
- **impr**: Centralize i18n messages and enhance test clarity

### v1.5.1
- **fix**: Fix array attribution override with shallow copy
- **fix**: Rules object reference issue resolved (clone rules instead of reference)

### v1.5.0
- **feat**: Add `addRules` method to add multiple rules as array
- **feat**: Add `overwriteRule` and `overwriteRules` methods
- **feat**: Add `clearRules()` method to clear previously added rules

### v1.4.0
- **feat**: Add `isRequiredField` option for optional validation
- **impr**: Renamed from `isOptionalField` to `isRequiredField` for clarity

### v1.3.2
- **feat**: Add `useFieldNameAsKey` option for alternative error format

### v1.3.1
- **fix**: Bug fixes for `useFieldNameAsKey` implementation

### v1.2.9
- **feat**: Initial implementation of `useFieldNameAsKey`

### v1.2.8
- **feat**: Add `IFieldsAndRules` TypeScript interface

### v1.2.7
- **impr**: Explicit rule interface for `| undefined` types

### v1.2.6
- **fix**: Minor bug fixes and improvements

### v1.2.5
- **docs**: README updates and documentation improvements

### v1.2.4
- **feat**: Add optional validation support

### v1.2.3
- **docs**: Documentation updates

### v1.2.2
- **fix**: Minor fixes

### v1.2.1
- **feat**: Add multiple fields and rules at once functionality
- **feat**: Add multiple rules feature

### v0.2.10
- **feat**: Add validation for non-existing objects

### v0.2.9
- **fix**: Remove unused functions and initial cleanup

---

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
