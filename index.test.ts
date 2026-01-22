
import requestCheck from './index'

const i18nKeys : Record<string, string> = {
  'rules.test.invalidNameMin': 'You need to have more than {{minNameLength}} characters in name! - I was translated!',
  'rules.test.invalidNameMustBeString': 'Your name must be a string - I was translated!',
  'rules.test.invalidBirthdate': 'The {{name}} {{value}} is not valid for field {{field}}! - I was translated!',
  'rules.test.ageRequirement': 'You need to be at least {{minAge}} years old! - I was translated!',
  'rules.test.invalidId': 'The value {{value}} is not a valid id! - I was translated!',
  'rules.test.nameMustBeAString': 'Name must be a string! - I was translated!',
  'rules.test.invalidName': 'Your name must be a string - I was translated!',
  'rules.test.invalidNameField': '{{field}} must be a string, but the value {{value}} is not valid for {{name}} - I was translated!'
}

test('it validates as expected', () => {
  
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', {
    validator: (age: any) => age > 18, 
    message: 'You need to be at least 18 years old!'
  })

  const requestBody = {
    name: 'Zarco',
    age: 8,
    color: undefined
  }

  const { name, age, color } = requestBody

  const invalid = rc.check({name}, {color}, {age})

  expect(invalid).toEqual([
    { 
      field: 'color', 
      message: 'The field color is required!' 
    },
    { 
      field: 'age', 
      message: 'You need to be at least 18 years old!' 
    }
  ])

})


test('it validates with more than one function', () => {
  
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', { 
    validator: (age: number) => age > 18, 
    message:'You need to be at least 18 years old!' 
  },
   {
    validator: (age: any) => age < 23,
    message: 'The age must be under 23!'
  })

  rc.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})

  const requestBody = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = requestBody

  const invalid = rc.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])

})

test('it validates with more than one function (array)', () => {
  
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addRules('age', [{ 
    validator: (age: number) => age > 18, 
    message:'You need to be at least 18 years old!' 
  },
   {
    validator: (age: any) => age < 23,
    message: 'The age must be under 23!'
  }])

  rc.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})

  const requestBody = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = requestBody

  const invalid = rc.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])

})


test('it validates with separated rules from same variable', () => {
    
  const rc = requestCheck()
  
  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', { 
    validator: (age: number) => age > 18, 
    message: 'You need to be at least 18 years old!' 
  })

  rc.addRule('age', {
    validator: (age: any) => age < 23,
    message: 'The age must be under 23!'
  })
  
  rc.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})

  const requestBody = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = requestBody

  const invalid = rc.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])

})

test('it override previous rules correctly', () => {
    
  const rc = requestCheck()
  
  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', { 
    validator: (age: number) => age > 18, 
    message: 'You need to be at least 18 years old!' 
  })

  rc.overwriteRule('age', {
    validator: (age: any) => age < 23,
    message: 'The age must be under 23!'
  })
  
  rc.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})
  
  const requestBodyRule1 = {
    name: 'Felipe',
    age: '23',
    color: 'yellow'
  }

  const requestBodyRule2 = {
    name: 'Zarco',
    age: '13',
    color: 'yellow'
  }

  let { name, color, age } = requestBodyRule1
  const invalidRule1 = rc.check({name}, {age}, {color})
  expect(invalidRule1).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])
  
  name = requestBodyRule2.name
  color = requestBodyRule2.color
  age = requestBodyRule2.age 
  
  const invalidRule2 = rc.check({name}, {age}, {color})
  expect(invalidRule2).toEqual([
    { field: 'color', message: 'Color must be blue!' }
  ])

  
  
})
test('it override and add multiple rules correctly', () => {
    
  const rc = requestCheck()
  
  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', { 
    validator: (age: number) => age > 18, 
    message: 'You need to be at least 18 years old!' 
  })

  rc.overwriteRules('age', [{
      validator: (age: any) => age < 23,
      message: 'The age must be under 23!'
    },
    { 
      validator: (age: number) => age > 15, 
      message: 'You need to be at least 15 years old!' 
    }
  ])
  
  rc.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})
  
  const requestBodyRule1 = {
    name: 'Felipe',
    age: '23',
    color: 'yellow'
  }

  const requestBodyRule2 = {
    name: 'Zarco',
    age: '13',
    color: 'yellow'
  }

  let { name, color, age } = requestBodyRule1
  const invalidRule1 = rc.check({name}, {age}, {color})
  expect(invalidRule1).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])
  
  name = requestBodyRule2.name
  color = requestBodyRule2.color
  age = requestBodyRule2.age 
  
  const invalidRule2 = rc.check({name}, {age}, {color})
  expect(invalidRule2).toEqual([
    { field: 'age', message: 'You need to be at least 15 years old!' },
    { field: 'color', message: 'Color must be blue!' },
  ])

  
  
})

test('it add multiple rules by various arguments', () => {
    
  const rc = requestCheck()
  
  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('color', 
    { validator: (color: any) => color === 'blue', message: 'Color must be blue!'}, 
    { validator: (color: any) => color.charAt(0).toLowerCase() === 'b', message: 'Color must start with letter B!'}, 
  )

  const requestBody = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = requestBody

  const invalid = rc.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'color', message: 'Color must be blue!' },
    { field: 'color', message: 'Color must start with letter B!'}
  ])

})


test('it add multiple rules by method which receives an array of rules', () => {
    
  const rc = requestCheck()
  
  rc.requiredMessage = 'The field :name is required!'

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

  const request = {
    name: 'Zarco',
    age: 'Twenty',
    color: 'yellow'
  }

  const { name, color, age } = request

  const invalid = rc.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'age', message: 'The age must be a number!' },
  ])

})

test('it can add multiple fields with rules with a single method', () => {
  
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addFieldsAndRules([
    {
      field: 'color', 
      rules: [{ 
        validator: (color: any) => color === 'blue', 
        message: 'Color must be blue!' 
      }]
    },
    {
      field: 'age', 
      rules: [{
        validator: (age: number) => age > 18, 
        message: 'You need to be at least 18 years old!'
      },
      { 
        validator: (age: number) => age < 23, 
        message: 'The age must be under 23!' 
      },
      {
        validator: (age: number) => !isNaN(age),
        message: 'The age must be a number!'
      }]
    }
  ])
  
  const requestBody: any = {
    age: 10,
    color: undefined
  }

  const { name, age, color } = requestBody

  const invalid = rc.check(
    {name},
    {color}, 
    {age}
  )
  
  expect(invalid).toEqual([
    { 
      field: 'name', 
      message: 'The field name is required!' 
    },
    { 
      field: 'color', 
       message: 'The field color is required!' 
     },
    { 
      field: 'age', 
      message: 'You need to be at least 18 years old!' 
    }
  ])

  
})



test('it can check only if is given', () => {
  
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addFieldsAndRules([
    {
      field: 'color', 
      rules: [{ 
        validator: (color: any) => color === 'blue', 
        message: 'Color must be blue!' 
      }]
    },
    {
      field: 'age', 
      rules: [{
        validator: (age: number) => age > 18, 
        message: 'You need to be at least 18 years old!'
      },
      { 
        validator: (age: number) => age < 23, 
        message: 'The age must be under 23!' 
      },
      {
        validator: (age: number) => !isNaN(age),
        message: 'The age must be a number!'
      }]
    }
  ])
  
  const requestBody: any = {
    color: undefined
  }

  const { name, age, color } = requestBody

  const invalid = rc.check(
    {name},
    {color}, 
    age ? {age} : {} 
  )
  
  expect(invalid).toEqual([
    { 
      field: 'name', 
      message: 'The field name is required!' 
    },
    { 
      field: 'color', 
       message: 'The field color is required!' 
     }
  ])

  
})


test('it uses field name as key', () => {
  
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'
  rc.useFieldNameAsKey = true

  rc.addFieldsAndRules([
    {
      field: 'age', 
      rules: [
      { 
        validator: (age: number) => age > 23, 
        message: 'The age must be above 23!' 
      }]
    }
  ])
  
  const requestBody: any = {
    age: 20
  }

  const { age } = requestBody

  const invalid = rc.check(
    age ? {age} : {} 
  )
  
  expect(invalid).toEqual([
    { 
      'age': 'The age must be above 23!' 
    }
  ])
  
  
})

test('it should pass if is an optional field', () => {
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addFieldsAndRules([{
    field: 'age', 
    rules: [{ 
      validator: (age: number) => age > 23, 
      message: 'The age must be above 23!' 
    }]
  }])
  
  const requestBody: any = {
    age: ''  
  }

  const { age } = requestBody

  const invalid = rc.check({ age, isRequiredField: false })
  
  expect(invalid).toBeUndefined()
})

test('it should return an error if is required field', () => {
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addFieldsAndRules([{
    field: 'age', 
    rules: [{ 
      validator: (age: number) => age > 23, 
      message: 'The age must be above 23!' 
    }]
  }])
  
  const requestBody: any = {
    age: undefined  
  }

  const { age } = requestBody

  const invalid = rc.check({ age, isRequiredField: true })
  
  expect(invalid).toEqual([{ field: 'age', message: 'The field age is required!' }])
})

test('it should return an error if is required field', () => {
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'
  rc.useFieldNameAsKey = true

  rc.addFieldsAndRules([{
    field: 'age', 
    rules: [{ 
      validator: (age: number) => age > 23, 
      message: 'The age must be above 23!' 
    }]
  }])

  const requestBody: any = {
    age: undefined  
  }

  const { age } = requestBody

  const invalid = rc.check({ age, isRequiredField: true })

  expect(invalid).toEqual([{ 'age': 'The field age is required!' }])

})

test('it clear rules when clearRules method is called', () => {
  const rc = requestCheck()

  rc.requiredMessage = 'The field :name is required!'

  rc.addFieldsAndRules([{
    field: 'age', 
    rules: [{ 
      validator: (age: number) => age > 23, 
      message: 'The age must be above 23!' 
    }]
  }])

  rc.clearRules()

  const requestBody: any = {
    age: 20  
  }

  const { age } = requestBody

  const invalid = rc.check({ age, isRequiredField: true })

  expect(invalid).toEqual(undefined)

})

test('it should be optional if requiredFiled is false', () => {
  const rc = requestCheck()
  rc.requiredMessage = 'The field :name is required!'
  rc.addFieldsAndRules([{
    field: 'age', 
    rules: [{ 
      validator: (age: number) => age > 23, 
      message: 'The age must be above 23!' 
    }]
  }])

  const requestBody: any = {
    age: undefined  
  }

  const { age } = requestBody

  const invalid = rc.check({ age, isRequiredField: false })

  expect(invalid).toEqual(undefined)
  
})

test('it should translate a message using i18n.key with i18n.options', () => {
  const rc = requestCheck()
  const minNameLength = 10
  
  rc.addRule('name', { 
    validator: (name: string) => name.length > minNameLength, 
    message: `You need to have more than ${minNameLength} characters in name!`,
    i18n: {
      key: 'rules.test.invalidNameMin',
      options: { minNameLength }
    }
  })

  const requestBody = {
    name: 'John', 
  }

  const name = requestBody.name

  const invalid = rc.check({ name })
  const invalidField = invalid[0]
  // It simulates the translation process
  const translatedMessage = i18nKeys[invalid[0]?.i18n?.key]
    .replace('{{minNameLength}}', invalid[0]?.i18n?.options?.minNameLength.toString())
  
  invalid[0].message = translatedMessage
  
  expect(invalid[0].i18n.options.minNameLength).toBe(minNameLength)

  expect(invalid).toEqual([
    { 
      field: 'name', 
      message: 'You need to have more than 10 characters in name! - I was translated!', 
      i18n: {
        key: 'rules.test.invalidNameMin',
        options: {
          minNameLength
        }
      }
    }
  ])
})

test('it should translate a message using i18n.key without i18n.options object', () => {
  const rc = requestCheck()
  
  rc.addRule('name', { 
    validator: (name: string) => typeof name === 'string', 
    message: `Your name must be a string`,
    i18n: { key: 'rules.test.invalidNameMustBeString' }
  })

  const requestBody = {
    name: 123, 
  }

  const name = requestBody.name

  const invalid = rc.check({ name })
  
  expect(invalid[0].message).toBe('Your name must be a string')
  expect(invalid[0].i18n.options).toBeUndefined()

  // It simulates the translation process
  const translatedMessage = i18nKeys[invalid[0]?.i18n?.key]
  invalid[0].message = translatedMessage
  
  expect(invalid).toEqual([
    {
      field: 'name',
      message: 'Your name must be a string - I was translated!', 
      i18n: {
        key: 'rules.test.invalidNameMustBeString'
      }
    }
  ])
})

test('it should translate a key with interpolation using :name, :value and :field replace', () => {
  const rc = requestCheck()
  const fieldName = 'birthdate'
  const fieldValue = '1990-05-20'
  
  rc.addRule(fieldName, { 
    validator: (birthdate: string) => false,
    message: `The :name :value is not valid for field :field!`,
    i18n: {
      key: 'rules.test.invalidBirthdate',
      options: {
        someOtherOption: 123
      }
    }
  })

  const birthdate = fieldValue

  const invalid = rc.check({ birthdate })

  expect(invalid[0].message).toBe('The birthdate 1990-05-20 is not valid for field birthdate!')
  
  // It simulates the translation process
  const translationKey = invalid[0].i18n.key
  const translationOptions = invalid[0].i18n.options

  const translatedMessage = i18nKeys[translationKey]
    .replace('{{name}}', translationOptions.name)
    .replace('{{value}}', translationOptions.value)
    .replace('{{field}}', translationOptions.field)

  invalid[0].message = translatedMessage
  expect(invalid[0].message).toBe(
    'The birthdate 1990-05-20 is not valid for field birthdate! - I was translated!'
  )
    
  expect(invalid).toEqual([
    { 
      field: 'birthdate',
      message: 'The birthdate 1990-05-20 is not valid for field birthdate! - I was translated!',
      i18n: {
        key: 'rules.test.invalidBirthdate',
        options: {
          someOtherOption: 123,
          value: fieldValue,
          name: fieldName,
          field: fieldName
        }
      }
    }
  ])
})

test('it should work with or without i18n object, translating only especified fields', () => {
  const rc = requestCheck()
  rc.setRequiredMessage('The field :name is required!')

  const minAge = 18

  rc.addRule('age', { 
    validator: (age: number) => age >= 18, 
    message: `You need to be at least ${minAge} years old!`,
    i18n: {
      key: 'rules.test.ageRequirement',
      options: { minAge }
    }
  })

  rc.addRule('id', { 
    validator: (id: number) => id > 0,
    message: `The value :value is not a valid id!`,
    i18n: {
      key: 'rules.test.invalidId'
    }
  })

  rc.addRule('name', { 
    validator: (name: string) => typeof name === 'string' && name.length > 0,
    message: `Name must be a string`,
    i18n: {
      key: 'rules.test.nameMustBeAString'
    }
  })

  rc.addRule('date', { 
    validator: (date: string) => true,
    message: `Date must be valid`
  })

  rc.addRule('birthdate', { 
    validator: (birthdate: string) => birthdate.length === 10,
    message: `Birthdate must be valid`
  })


  const requestBody: any = {
    id: -1,
    age: 2,
    name: 1111,
    date: undefined,
    birthdate: 'invalid-date'
  }

  const { age, name, id, date, birthdate } = requestBody

  const invalid = rc.check(
    { name }, 
    { age }, 
    { id },
    { date, isRequiredField: true },
    { birthdate }
  )

  const nameField = invalid.find((err: any) => err.field === 'name')
  if(nameField) {
    nameField.message = i18nKeys[nameField.i18n.key]
  }

  const ageField = invalid.find((err: any) => err.field === 'age')
  if(ageField) {
    ageField.message = i18nKeys[ageField.i18n.key]
      .replace('{{minAge}}', ageField.i18n.options?.minAge?.toString())
  }

  const idField = invalid.find((err: any) => err.field === 'id')
  if(idField) {
    idField.message = i18nKeys[idField.i18n.key]
      .replace('{{value}}', idField.i18n.options?.value?.toString())
  }

  expect(invalid).toEqual([
    {
      field: 'name',
      message: 'Name must be a string! - I was translated!',
      i18n: { 
        key: 'rules.test.nameMustBeAString'
      }
    },
    {
      field: 'age',
      message: 'You need to be at least 18 years old! - I was translated!',
      i18n: {
        key: 'rules.test.ageRequirement',
        options: { minAge }
      }
    },
    {
      field: 'id',
      message: 'The value -1 is not a valid id! - I was translated!',
      i18n: {
        key: 'rules.test.invalidId',
        options: { value: id }
      }
    },
    {
      field: 'date',
      message: 'The field date is required!'
    },
    {
      field: 'birthdate',
      message: 'Birthdate must be valid'
    }
  ])
})

test('it override a rule adding i18n', () => {
  const rc = requestCheck()

  rc.addRule('age', { 
    validator: (age: number) => age > 18, 
    message: 'You need to be at least 18 years old!' 
  })

  const requestBody = {
    age: 16
  }

  const { age } = requestBody

  const invalid = rc.check({age})

  expect(invalid).toEqual([
    { 
      field: 'age', 
      message: 'You need to be at least 18 years old!'
    }
  ])

  rc.overwriteRule('age', {
    validator: (age: number) => age > 18,
    message: 'You need to be at least 18 years old!',
    i18n: { key: 'rules.test.ageRequirement' }
  })

  const invalidAfterOverwrite = rc.check({age})

  expect(invalidAfterOverwrite).toEqual([
    { 
      field: 'age', 
      message: 'You need to be at least 18 years old!',
      i18n: { key: 'rules.test.ageRequirement' }
    }
  ])
})

test('it should translate with useFieldNameAsKey configuration activated', () => {
  const rc = requestCheck()
  rc.useFieldNameAsKey = true

  rc.addRule('name', { 
    validator: (name: string) => typeof name === 'string', 
    message: 'Your name must be a string',
    i18n: { key: 'rules.test.invalidNameMustBeString' }
  })

  const requestBody = {
    name: 123, 
  }

  const name = requestBody.name

  const invalid = rc.check({ name })
  const nameField = invalid[0].name

  expect(nameField.message).toBe('Your name must be a string')
  expect(nameField.i18n.options).toBeUndefined()

  // It simulates the translation process
  const translatedMessage = i18nKeys[nameField.i18n.key]
  if(invalid.length && nameField.i18n.key) {
    nameField.message = translatedMessage
  }

  expect(invalid).toEqual([
    { 
      name: {
        message: 'Your name must be a string - I was translated!', 
        i18n: {
          key: 'rules.test.invalidNameMustBeString' 
        }
      }
    }
  ])
})

test('it should translate with useFieldNameAsKey configuration activated and add :name, :value and :field in i18n.options', () => {
  const rc = requestCheck()
  rc.useFieldNameAsKey = true

  rc.addRule('name', { 
    validator: (name: string) => typeof name === 'string', 
    message: `:field must be a string, but the value :value is not valid for :name`,
    i18n: { 
      key: 'rules.test.invalidNameField',
      options: { someOtherOption: 123 }
    }
  })

  const requestBody = {
    name: 123, 
  }
  const name = requestBody.name

  const invalid = rc.check({ name })
  const nameField = invalid[0].name

  expect(nameField.message).toBe('name must be a string, but the value 123 is not valid for name')
  
  // It simulates the translation process
  const translatedMessage = i18nKeys[nameField.i18n.key]
    .replace('{{field}}', nameField.i18n.options?.field)
    .replace('{{value}}', String(nameField.i18n.options?.value))
    .replace('{{name}}', nameField.i18n.options?.name)
  
  if(invalid.length && nameField.i18n.key ) {
    nameField.message = translatedMessage
  }

  expect(invalid).toEqual([
    { 
      name: {
        message: 'name must be a string, but the value 123 is not valid for name - I was translated!', 
        i18n: {
          key: 'rules.test.invalidNameField' ,
          options: {
            someOtherOption: 123,
            value: 123,
            name: 'name',
            field: 'name'
          }
        }
      }
    }
  ])
})