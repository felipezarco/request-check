const isFunction = (variable: any) => variable && {}.toString.call(variable) === '[object Function]'

class RequestCheck {

  rules: any
  requiredMessage: string

  constructor() {
    this.requiredMessage = 'Este campo é de preenchimento obrigatório!'
    this.rules = {}
  }

  setRequiredMessage = (message: string) => {
    this.requiredMessage = message
  }

  addRule = (field: string, ...rules: { fn: any, message: string }[]) => {
    while(rules.length) {
      let rule = rules.shift()
      if(rule) {
        let { fn, message } = rule
        rule.message.replace(':name', name).replace(':field', name)
        field in this.rules ? this.rules[field].push({ fn, message }) : 
        this.rules[field] = [{ fn, message }]
      }
    }
  }

  check = (...args: Array<any>): Array<{ name: string, message: string }> | undefined => {
    let invalid: Array<{name: string, message: string}> = []
    while(args.length) {
      let object = args.shift()
      let name = Object.keys(object)[0], value = object[name]
      if(!value && value !== false) invalid.push({ 
        name, message: this.requiredMessage
        .replace(':name', name).replace(':field', name).replace(':value', value)
      })
      else if(name in this.rules) {
        let array = [ ...this.rules[name]]
        while(array.length) {
          let validation = array.shift()
          if(!validation.fn(value)) {
            invalid.push({
              name, message: validation.message
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