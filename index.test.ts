
import validator from './index'

test('it validates as expected', () => {

  validator.requiredMessage = 'The field :name is required!'

  validator.addRule('age', {
    validator: (age: any) => age > 18, 
    message: 'You need to be at least 18 years old!'
  })

  const request = {
    name: 'Zarco',
    age: 8,
    color: undefined
  }

  const { name, age, color } = request

  const invalid = validator.check({name}, {color}, {age})

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

  validator.requiredMessage = 'The field :name is required!'

  validator.addRule('age', { 
    validator: (age: number) => age > 18, 
    message:'You need to be at least 18 years old!' 
  },
   {
    validator: (age: any) => age < 23,
    message: 'The age must be under 23!'
  })

  validator.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})

  const request = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = request

  const invalid = validator.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])

})


test('it validates with separated rules from same variable', () => {

  validator.requiredMessage = 'The field :name is required!'

  validator.addRule('age', { 
    validator: (age: number) => age > 18, 
    message:'You need to be at least 18 years old!' 
  })

  validator.addRule('age', {
    validator: (age: any) => age < 23,
    message: 'The age must be under 23!'
  })

  validator.addRule('color', { validator: (color: any) => color === 'blue', message: 'Color must be blue!'})

  const request = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = request

  const invalid = validator.check({name}, {age}, {color})

  expect(invalid).toEqual([
    { field: 'age', message: 'The age must be under 23!' },
    { field: 'color', message: 'Color must be blue!' }
  ])

})
