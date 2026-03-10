import jwt from 'jsonwebtoken'
import { SECRET_WORD } from '../../config/envs.js'

const generarToken = (data) => {
  const token = jwt.sign(data, SECRET_WORD)
  return token
}

const validarToken = (token) => {
  return jwt.verify(token, SECRET_WORD)
}

export default {
  generarToken,
  validarToken,
}
