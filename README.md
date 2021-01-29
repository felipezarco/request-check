# Request Check

> Check whether data is what it is meant to be

You should not always believe the data is exactly what you think it is. Hopefully, you will validate data you received, for example when it comes to one of your controllers. This module helps with that. I found that many of the validators out there are either incomplete or not fully customizable. Therefore, I built my own. It is rather simple and it works.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensouvalidatore.org/licenses/MIT) [![npm version](https://badge.fury.io/js/request-check.svg)](https://badge.fury.io/js/request-check) [![Build Status](https://travis-ci.org/felipezarco/request-check.svg?branch=master)](https://travis-ci.org/felipezarco/request-check) [![Coverage Status](https://coveralls.io/repos/github/felipezarco/request-check/badge.svg?branch=master)](https://coveralls.io/github/felipezarco/request-check?branch=master)  ![Downloads](https://img.shields.io/npm/dw/request-check)

[![npm](https://nodei.co/npm/request-check.png)](https://www.npmjs.com/package/request-check)

## Install

Add `request-check` with your favorite package manager:

```bash
yarn add request-check
```

## Usage

```typescript

import requestCheck from 'request-check'

import { Request, Response } from 'express'

class UserController {

  async create(request: Request, response: Response) {

  const { email, name } = request.body
  
  const rc = requestCheck()
  
  /* invalid will only avaliate to true if variables pass the check */

  const invalid = rc.check({email}, {name})

  if(invalid) {
  
    // Case some invalid
 
    response.status(400).json({ invalid })
  }
  
  // Case no invalid...
  
}

```

### Basic Check

This line checks whether those two variables are set.

```javascript
  const invalid = rc.check({email}, {name})
```

Check will return an `Array` of objects with `field` and `message` **or** it will return `undefined`.

In the above example, if variables `email` and `name` were not set, invalid will contain:

```javascript
[
  { field: 'name', message: 'The field name is required!' },
  { field: 'email', message: 'The field email is required!' }
]
```

If both variables were set, `check` would return **undefined** and `invalid` would avaliate to `false`.

### Validations

In addition to check if the variable is set, `check` will also look for a rule definition for that variable.

This is how you can add a rule:

```typescript
rc.addRule('email', {
  validator: (email: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)), 
  message: 'The email given is not valid!'
})
```

Suppose the variable values:

```javascript
const email = 'felipezarco@hotmail.com'
const name = undefined
```

Now, when you call:

```javascript
  const invalid = rc.check({email}, {name})
```

The output stored in `invalid` will contain:

```javascript
[
  { field: 'name', message: 'The field name is required!' },
  { field: 'email', message: 'The email given is not valid!' }
]
```

### Conditional validation

You can use this if you want to validate only if variable is set:

```javascript
  const invalid = rc.check(
    {name},
    {color}, 
    age ? {age} : undefined
  ) 
```

In the example above, if age is not given check will not send the required field message. Therefore making `age` an optional field and `name` and `color` required fields. 

Using empty object `{}` instead of `undefined` will work as well.
  
### Adding multiple rules

You can add more rules by passing additional arguments to `addRule`:

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

Optionally, you may pass an array of rules as the second argument:

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

### Usage Recommendation

```javascript

import { Request, Response } from 'express'
import requestCheck from 'request-check'
import responser from 'responser'

class UserController {

  async create(request: Request, response: Response) {

    const { email, name } = request.body
    
    const rc = requestCheck()
    
    const invalid = rc.check({email}, {name})

    if(invalid) {
      response.send_badRequest('Invalid fields!', invalid)
    }
    
    // ...
  
  }

}

```

Responser is a simple way to send responses in express. Check it out at: https://www.npmjs.com/package/responser

### Request Check Instance

The `requestCheck()` method will create a new stored `rc` with its own rules.

You can export `rc` or the rules array to another file using module export for better organization.

Remember that while using the same instance, `rc` will check all rules added to it previously. 

### Configuration

You can change the default required message by adding a single line of code:

```javascript
rc.requiredMessage = 'The field :name was not given =(!'
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

You can (and should) [open an issue](https://github.com/felipezarco/request-check/issues/new) or even a [pull request](https://github.com/felipezarco/request-check/compare)!

Thanks for your interest in contributing to this repo!

## Author

[Luiz Felipe Zarco](https://github.com/felipezarco) (felipezarco@hotmail.com)

## License

This code is licensed under the [MIT License](https://github.com/felipezarco/request-check/blob/master/LICENSE.md). See the [LICENSE.md](https://github.com/felipezarco/request-check/blob/master/LICENSE.md) file for more info.
