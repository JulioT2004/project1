const { z } = require('zod');

const laptopSchema = z.object({
  id: z.number({ invalid_type_error: 'El id debe ser un número' }), 
  model: z.string().min(1, { message: 'El modelo es obligatorio' }),
  userId: z.number().nullable().optional() // Puede ser nulo o no enviado
});

module.exports =  {laptopSchema} ;