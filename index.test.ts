
import rc from './index'

test('it validates as expected', () => {

  rc.requiredMessage = 'The field :name is required!'

  rc.addRule('age', (age: any) => age > 18, 'You need to be at least 18 years old!')

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