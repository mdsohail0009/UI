import * as yup from "yup";

export function createYupSchema(schema, config) {
  const { id, dataType, validations = [] } = config;
  if (!yup[dataType]) {
    return schema;
  }
  let validator = yup[dataType]();
  validations.forEach(validation => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });
  schema[id] = validator;
  return schema;
}
