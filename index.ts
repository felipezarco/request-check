interface IRule {
  validator: Function
  message: string
}

interface IFieldsAndRules {
  field: string
  rules: IRule[]
}

interface ICheck {
  field: string
  message: string
}

interface ICheckObj {
  [key: string]: any
  isOptionalField?: boolean
}

interface IInvalidField { 
  value: any 
  field: any 
  message: string 
}

const isEmptyObject = (object: any) => Object.keys(object).length === 0 && object.constructor === Object

const isObject = (object: any) => typeof object === 'object' && object !== null

class RequestCheck {

  rules: any
  requiredMessage: string
  useFieldNameAsKey: boolean

  constructor() {
    this.requiredMessage = 'This field is required!'
    this.useFieldNameAsKey = false
    this.rules = {}
  }

  setRequiredMessage = (message: string) => {
    this.requiredMessage = message
  }

  addRule = (field: string, ...rules: IRule[]) => {
    this.addRules(field, rules)
  }

  addRules = (field: string, rules: IRule[]) => {
    let rule: IRule | undefined = undefined
    while(rule = rules.shift() as IRule | undefined) {
      let { validator, message } = rule
      field in this.rules ? this.rules[field].push({ validator, message }) : 
      this.rules[field] = [{ validator, message }]
    }
  }
  
  addFieldsAndRules = (fieldsAndRules: IFieldsAndRules[]) => {
    let fieldAndRule: IFieldsAndRules | undefined = undefined
    while(fieldAndRule = fieldsAndRules.shift() as IFieldsAndRules | undefined) {
      this.addRules(fieldAndRule.field, fieldAndRule.rules)
    }
  }

  buildInvalidField = ({ value, field, message }: IInvalidField) => {
    if (this.useFieldNameAsKey) {
      return { [field]: message.replace(':name', field).replace(':field', field).replace(':value', value) }
    }
    
    return {
      field,
      message: message.replace(':name', field).replace(':field', field).replace(':value', value)
    }
  }

  check = (...args: Array<ICheckObj>): Array<ICheck> | any | undefined => {
    let invalid: Array<ICheck> | any = []
    while(args.length) {
      let object = args.shift()
      if (!object || !isObject(object) || isEmptyObject(object)) continue
      const entries = Object.entries(object)
      const isOptionalField = [true].includes(entries?.find(([entry]) => entry === 'isOptionalField')?.[1])

      const field = entries?.find(([entry]) => entry !== 'isOptionalField')
      const label = field?.[0]
      const value = field?.[1]

      const isRequired = !isOptionalField && (value === undefined || value === null)

      if (isRequired) {
        const invalidField = this.buildInvalidField({ value, field: label, message: this.requiredMessage, })
        invalid.push(invalidField)
        continue
      }

      if (label && label in this.rules) {
        const array = this.rules[label]

        while(array.length) {
          let validation = array.shift()
          if(!validation.validator(value)) {
            const invalidField = this.buildInvalidField({ value, field: label, message: validation.message })
            invalid.push(invalidField)
          }
        }
      }
    }

    return invalid.length ? invalid : undefined
  }
}

const requestCheck = () => new RequestCheck()

export default requestCheck
