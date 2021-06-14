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
  [key: string]: string
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
  
  check = (...args: Array<any>): Array<ICheck> | any | undefined => {
    let invalid: Array<ICheck> | any = []
    while(args.length) {
      let object = args.shift()
      if(!object || !isObject(object) || isEmptyObject(object)) continue
      let field = Object.keys(object)[0], value = object[field]
      if(!value && value !== false && value !== 0) {
        this.useFieldNameAsKey ?
          invalid.push({ 
            [field]: this.requiredMessage
            .replace(':name', field).replace(':field', field).replace(':value', value)
          }) : invalid.push({ 
            field, message: this.requiredMessage
            .replace(':name', field).replace(':field', field).replace(':value', value)
          })
      }
      else if(field in this.rules) {
        let array = [ ...this.rules[field]]
        while(array.length) {
          let validation = array.shift()
          if(!validation.validator(value)) {
            this.useFieldNameAsKey ? invalid.push({ [field]: validation.message }) : invalid.push({ field, message: validation.message})
          }
        }
      }
    }
    return invalid.length ? invalid : undefined
  }
}

const requestCheck = () => new RequestCheck()

export default requestCheck
