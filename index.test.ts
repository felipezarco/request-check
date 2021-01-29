
import requestCheck from './index'

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
