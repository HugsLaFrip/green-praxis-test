import { valid } from "geojson-validation"

export const namePresent = (req, res, next) => {
  // Make sure name property is present
  if (!('name' in req.body)) {
    return res.status(422).json({ message: 'Property name is needed' })
  }
}

export const nameAndPerimeterPresent = (req, res, next) => {
  // Make sure we have a name and perimeter
  if (!('name' in req.body) || !('perimeter' in req.body)) {
    return res.status(422).json({ message: "Property name and perimeter are needed" })
  }
  next()
}

export const validPerimeter = (req, res, next) => {
  // Make sure perimeter is valid geojson
  if (!valid(req.body.perimeter)) {
    return res.status(422).json({ message: "Perimeter is not a valid geojson" })
  }
  next()
}

export const twoProjectPresent = (req, res, next) => {
  // check if properties are present
  if (!('firstProjectId' in req.body) || !('secondProjectId' in req.body)) {
    return res.status(422).json({ message: 'Properties firstProjectId and secondProjectId are needed' })
  }
  next()
}