const { z } = require("zod");

const emailDomain = "@cuevatech.com";

const userSchema = z.object({
  dni: z.string()
    .regex(/^[0-9]{8}$/, "El DNI debe tener 8 dígitos"),
  email: z.string()
    .email("Correo inválido")
    .refine((val) => val.endsWith(emailDomain), {
      message: `El correo debe pertenecer al dominio ${emailDomain}`
    }),
  firstName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  lastName: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede superar los 100 caracteres"),
  phone: z.string()
    .regex(/^\+?[0-9]{7,15}$/, "Número de teléfono inválido"),
  jobTitle: z.string()
    .min(2, "El puesto debe tener al menos 2 caracteres"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
});

module.exports = { userSchema };