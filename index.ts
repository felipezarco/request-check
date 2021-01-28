interface IRule {
  validator: Function
  message: string
}

interface IFieldsAndRules {
  field: string
  rules: IRule[]
}

interface ICheckable {
  field: string
  message: string
}


class RequestCheck {

  rules: any
  requiredMessage: string

  constructor() {
    this.requiredMessage = 'This field is required!'
    this.rules = {}
  }

  setRequiredMessage = (message: string) => {
    this.requiredMessage = message
  }

  addRule = (field: string, ...rules: IRule[]) => {
    this.addRules(field, rules)
  }

  addRules = (field: string, rules: IRule[]) => {
    let rule = undefined
    while(rule = rules.shift()) {
      let { validator, message } = rule
      field in this.rules ? this.rules[field].push({ validator, message }) : 
      this.rules[field] = [{ validator, message }]
    }
  }
  
  addFieldsAndRules = (fieldsAndRules: IFieldsAndRules[]) => {
    let fieldAndRule = undefined
    while(fieldAndRule = fieldsAndRules.shift()) {
      this.addRules(fieldAndRule.field, fieldAndRule.rules)
    }
  }
  
  check = (...args: Array<any>): Array<ICheckable> | undefined => {
    let invalid: Array<ICheckable> = []
    while(args.length) {
      let object = args.shift()
      if(!object) continue
      let field = Object.keys(object)[0], value = object[field]
      if(!value && value !== false && value !== 0) invalid.push({ 
        field, message: this.requiredMessage
        .replace(':name', field).replace(':field', field).replace(':value', value)
      })
      else if(field in this.rules) {
        let array = [ ...this.rules[field]]
        while(array.length) {
          let validation = array.shift()
          if(!validation.validator(value)) {
            invalid.push({
              field, message: validation.message
            })
          }
        }
      }
    }
    return invalid.length ? invalid : undefined
  }
}

const requestCheck = () => new RequestCheck()

export default requestCheck
