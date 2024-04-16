import { Meteor } from "meteor/meteor"
import noop from "/imports/Common/noop"

function validationErrorToObject(error = {}) {
  let { details: errorDetails = [] } = error
  const errorObj = {}

  for (const { path = [], message = "" } of errorDetails) {
    errorObj[path.join(".")] = message
  }

  if (Object.keys(errorObj).length > 0) {
    return errorObj
  } else {
    return null
  }
}

function validateWithJoi(payload, schema, shouldThrow = true) {
  if (schema !== null) {
    const { error } = schema.validate(payload, {
      abortEarly: false
    })

    if (error) {
      if (shouldThrow) {
        throw new Meteor.Error(
          error.name,
          error.message,
          JSON.stringify(error.details)
        )
      } else {
        return validationErrorToObject(error)
      }
    }
  }
}

function ValidatedMethod(methodName, cb, schema = null) {
  Meteor.methods({
    [methodName](payload) {
      if (Meteor.isServer) {
        // already validated on the client
        validateWithJoi(payload, schema)
      }

      return cb.call(this, payload)
    }
  })

  return (payload, callback = noop) => {
    validateWithJoi(payload, schema)

    Meteor.call(methodName, payload, (error, result) => {
      if (error) {
        if (error.error === 404) {
          console.error(
            `${error.message} - did you remember to import the model in server.js?`
          )
        } else {
          throw error
        }
      }

      if (typeof callback === "function") {
        return callback(result)
      }
    })
  }
}

export { validationErrorToObject, validateWithJoi, ValidatedMethod }
