const z = require("zod");


// esto asume que la fecha viene como string

const vacationSchema = z.object({
 startDate: z.string().refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Fecha inválida, formato YYYY-MM-DD' }),
  endDate: z.string().refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Fecha inválida, formato YYYY-MM-DD' }),
})

module.exports = { vacationSchema };


