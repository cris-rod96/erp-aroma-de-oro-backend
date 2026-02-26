import { body } from "express-validator";

const validacionCrearUsuario = [
  body("cedula")
    .notEmpty()
    .withMessage("La cédula es obligatoria")
    .matches(/^[0-9]{10}$/)
    .withMessage("La cédula debe tener exactamente 10 dígitos numéricos"),

  body("telefono")
    .notEmpty()
    .withMessage("El teléfono es obligatorio")
    .matches(/^[0-9]{10}$/)
    .withMessage("El teléfono debe tener exactamente 10 dígitos numéricos"),
  body("correo")
    .matches(/^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Debe ser un correo válido y realista")
    .normalizeEmail(),
];

export default {
  validacionCrearUsuario,
};
