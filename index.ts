interface IRule {
  validator: Function
  message: string
  i18n?: II18nMessage
}

interface IFieldsAndRules {
  field: string
  rules: IRule[]
}

interface ICheck {
  field: string
  message: string
  i18n?: II18nMessage
}

interface ICheckObj {
  [key: string]: any
  isRequiredField?: boolean
}

interface IInvalidField { 
  value: any 
  field: any 
  message: string 
  i18n?: II18nMessage
}

interface II18nMessage {
  key: string
  options?: Record<string, any>
}

const isEmptyObject = (object: any) => Object.keys(object).length === 0 && object.constructor === Object

const isObject = (object: any) => typeof object === 'object' && object !== null

const buildI18nMessage = (message: string, field: string, value: any, i18n: II18nMessage): II18nMessage | undefined => {
  const i18nOptions: Record<string, any> = {}
  if (i18n.options) {
    Object.assign(i18nOptions, i18n.options)
  }
  if (message.includes(':value')) i18nOptions.value = value
  if (message.includes(':name')) i18nOptions.name = field
  if (message.includes(':field')) i18nOptions.field = field

  const result: II18nMessage = { key: i18n.key }
  if (Object.keys(i18nOptions).length > 0) {
    result.options = i18nOptions
  }
  return result
}

class RequestCheck {

  rules: any
  requiredMessage: string
  useFieldNameAsKey: boolean

  constructor() {
    this.requiredMessage = 'This field is required!'
    this.useFieldNameAsKey = false
    this.rules = {}
  }

  clearRules = () => {
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
      let { validator, message, i18n } = rule
      field in this.rules ? this.rules[field].push({ validator, message, i18n }) : 
      this.rules[field] = [{ validator, message, i18n }]
    }
  }
  
  overwriteRule = (field: string, ...rules: IRule[]) => {
    if(field?.length) delete this.rules[field]
    this.addRule(field, ...rules)
  }
  
  overwriteRules = (field: string, rules: IRule[]) => {
    if(field?.length) delete this.rules[field]
    this.addRules(field, rules)
  }
  
  addFieldsAndRules = (fieldsAndRules: IFieldsAndRules[]) => {
    let fieldAndRule: IFieldsAndRules | undefined = undefined
    while(fieldAndRule = fieldsAndRules.shift() as IFieldsAndRules | undefined) {
      this.addRules(fieldAndRule.field, fieldAndRule.rules)
    }
  }

  buildInvalidField = ({ value, field, message, i18n }: IInvalidField) => {
    const i18nMessage = i18n ? buildI18nMessage(message, field, value, i18n) : undefined
    const messageReplaced = message.replace(':name', field).replace(':field', field).replace(':value', value)
    if (this.useFieldNameAsKey) {
      if (i18nMessage) {
        return {
          [field]: {
            message: messageReplaced,
            i18n: i18nMessage
          }
        }
      }
      return { [field]: messageReplaced }
    }
    const result: any = {
      field,
      message: messageReplaced
    }
    if (i18nMessage) {
      result.i18n = i18nMessage
    }
    return result
  }

  check = (...args: Array<ICheckObj>): Array<ICheck> | any | undefined => {
    let invalid: Array<ICheck> | any = []
    while(args.length) {
      let object = args.shift()
      if (!object || !isObject(object) || isEmptyObject(object)) continue
      const entries = Object.entries(object)
      const isOptionalField = [false].includes(entries?.find(([entry]) => entry === 'isRequiredField')?.[1])

      const field = entries?.find(([entry]) => entry !== 'isRequiredField')
      const label = field?.[0]
      const value = field?.[1]

      const isMissing = [undefined, null, ''].includes(value)

      if (isOptionalField && isMissing) {
        continue
      }

      if (isMissing) {
        const invalidField = this.buildInvalidField({ value, field: label, message: this.requiredMessage, })
        invalid.push(invalidField)
        continue
      }

      if (label && label in this.rules) {
        const array = [...this.rules[label]]

        while(array.length) {
          let validation = array.shift()
          if(!validation.validator(value)) {
            const invalidField = this.buildInvalidField({ value, field: label, message: validation.message, i18n: validation.i18n })
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
