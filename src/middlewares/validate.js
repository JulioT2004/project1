const { ZodError } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    try {
      // Usamos safeParse para no depender de excepciones
      const result = schema.safeParse(req.body);

      if (result.success) {
        req.validatedData = result.data; // datos validados y limpios
        return next();
      }

      // Aquí ya sabemos que hay errores
      const zodError = result.error; // ZodError
      const errors = Array.isArray(zodError.issues)
        ? zodError.issues.map((issue) => ({
            field: Array.isArray(issue.path)
              ? issue.path.join('.')
              : String(issue.path),
            message: issue.message,
          }))
        : [];

      return res.status(400).json({
        message: 'Error de validación',
        errors,
      });
    } catch (err) {
      console.error('validate middleware error:', err);
      return res.status(500).json({
        message: 'Error interno en validación',
      });
    }
  };
}

module.exports = validate;
