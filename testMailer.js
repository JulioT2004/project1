


require("dotenv").config();
const { sendEmail } = require("./src/utils/mailer");

(async () => {
  try {
    await sendEmail(
      "20235290@aloe.ulima.edu.pe.com",
      "Prueba de envío",
      "<h1>¡Funciona!</h1><p>Este es un correo de prueba.</p>"
    );
    console.log("Correo enviado con éxito ✅");
  } catch (error) {
    console.error("Error enviando correo ❌:", error);
  }
})();