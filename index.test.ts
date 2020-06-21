
import rc from './index'

test('it validates as expected', () => {

  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', {
    fn: (age: any) => age > 18, 
    message: 'You need to be at least 18 years old!'
  })

  const request = {
    name: 'Zarco',
    age: 8,
    color: undefined
  }

  const { name, age, color } = request

  const invalid = rc.check({name}, {color}, {age})

  expect(invalid).toEqual([
    { 
      name: 'color', 
      message: 'The field color is required!' 
    },
    { 
      name: 'age', 
      message: 'You need to be at least 18 years old!' 
    }
  ])

})


test('it validates with more than one function', () => {

  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', { 
    fn: (age: number) => age > 18, 
    message:'You need to be at least 18 years old!' 
  },
   {
    fn: (age: any) => age < 23,
    message: 'The age must be under 23!'
  })

  rc.addRule('color', { fn: (color: any) => color === 'blue', message: 'Color must be blue!'})

  const request = {
    name: 'Zarco',
    age: '23',
    color: 'yellow'
  }

  const { name, color, age } = request

  const invalid = rc.check({name}, {age}, {color})

  console.log(invalid)

  expect(invalid).toEqual([
    { name: 'age', message: 'The age must be under 23!' },
    { name: 'color', message: 'Color must be blue!' }
  ])

})