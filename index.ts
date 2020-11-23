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

  addRule = (field: string, ...rules: { validator: any, message: string }[]) => {
    while(rules.length) {
      let rule = rules.shift()
      if(rule) {
        let { validator, message } = rule
        field in this.rules ? this.rules[field].push({ validator, message }) : 
        this.rules[field] = [{ validator, message }]
      }
    }
  }

  check = (...args: Array<any>): Array<{ field: string, message: string }> | undefined => {
    let invalid: Array<{field: string, message: string}> = []
    while(args.length) {
      let object = args.shift()
      let field = Object.keys(object)[0], value = object[field]
      if(!value && value !== false) invalid.push({ 
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
            break
          }
        }
      }
    }
    return invalid.length ? invalid : undefined
  }
}

export default new RequestCheck()
