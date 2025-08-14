const prisma = require("../config/db");
const { get } = require("../routes/userRoutes");
const {sendEmail}  = require("../utils/mailer");

async function createVacation(req, res) { 
    try {
        const { startDate, endDate } = req.body;
        const userId = req.user.userId;
        const end = new Date(endDate);
        const start = new Date(startDate);
        // Validar fechas
        if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
        }


        // Validar días disponibles
         const user1 = await prisma.user.findUnique({ where: { id: userId } });
        if (!user1) return res.status(404).json({ error: 'Usuario no encontrado.' });

        // Validar si tiene solicitud pendiente
        const pending = await prisma.vacation.findFirst({
        where: { userId, status: 'PENDING' }
        });
        if (pending) {
        return res.status(400).json({ error: 'Ya tienes una solicitud de vacaciones pendiente.' });
        }

        // Calcular días solicitados
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysRequested = Math.ceil((end - start) / msPerDay) + 1;
        if (daysRequested > user1.vacationDayAvailable) {
        return res.status(400).json({ error: 'No tienes suficientes días disponibles.' });
        }

        
    
        // Crear la solicitud de vacaciones
        const vacation = await prisma.vacation.create({
        data: {
            startDate: start,
            endDate: end,
            userId,
        },
        });

        sendVacationRequestEmail(vacation);
        return res.status(201).json({ message: "Solicitud de vacaciones creada con éxito", vacation });
    } catch (error) {
        console.error("Error al crear solicitud de vacaciones:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
    }



    ///para hacer el email 
    /**
     * const message = `<H1>Solicitud de Vacaciones</H1>
        <p>${vacation.startDate.toISOString().split('T')[0]} - ${vacation.endDate.toISOString().split('T')[0]}</p>`;
    
        // Enviar correo de notificación
        await sendVacationRequestEmail(req.user.email,"Solicitud vacaciones" ,vacation.startDate);
     * 
     * 
     * 
     */


async function sendVacationRequestEmail(vacation) {

    //const emailAdmin = await prisma.user.findFirst({
     //   where: { isSuperuser: true },
      //  select: { email: true }
    //});

    //Este correo debería ir al de recursos humanos o al administrador (mi correo personal por ahora) 
    const emailAdmin = "juliocesarteranlinares55@gmail.com"
    const user = await prisma.user.findUnique({
        where: { id: vacation.userId },
        select: { firstName: true, lastName: true }
    });
    const message = `<h1>Solicitud de Vacaciones</h1>
    <p> El Usuario: ${user.firstName} ${user.lastName} solicita vacaciones las siguientes fechas</p>
    <p>Fecha de inicio: ${vacation.startDate.toISOString().split('T')[0]}</p>
    <p>Fecha de fin: ${vacation.endDate.toISOString().split('T')[0]}</p>
    
    <p>Por favor, <br> revisa y cambia el estado de la solicitud</br>.</p>
    `;
    
    await sendEmail(emailAdmin, 'Atender solicitud de vacaciones', message);
}       


async function sendVacationStatusEmail(vacation) {
    const user = await prisma.user.findUnique({
        where: { id: vacation.userId },
        select: { email: true, firstName: true, lastName: true }
    });

    const message = `<h1>Estado de Solicitud de Vacaciones</h1>
    <p>Hola ${user.firstName} ${user.lastName},</p>
    <p>Tu solicitud de vacaciones del ${vacation.startDate.toISOString().split('T')[0]} al ${vacation.endDate.toISOString().split('T')[0]}</p>
    <p>Ha sido ${vacation.status === 'APPROVED' ? 'aprobada' : 'rechazada'} por el administrador.</p>
    <p>Gracias.</p>
    `;

    sendEmail(user.email, 'Estado de Solicitud de Vacaciones', message);
}


async function updateVacation(req, res) {
    const { id } = req.params;
    const { status } = req.body;


    if (status !== 'APPROVED' && status !== 'DENIED') {
        return res.status(400).json({ error: 'Estado inválido. Debe ser APPROVED o DENIED.' });
    }

    try {
        const updatedVacation = await prisma.vacation.update({
            where: { id: parseInt(id) },
            data: { status , reviewedBy: req.user.userId },
        });

        const diffTime = updatedVacation.endDate.getTime() - updatedVacation.startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el primer día



        // Si la solicitud es aprobada, actualizar los días disponibles del usuario
        if (status === 'APPROVED') {
            await prisma.user.update({
                where: { id: updatedVacation.userId },
                data: { vacationDayAvailable: { decrement: diffDays } }
            });
        }
        
        
        console.log("Correo enviado al usuario sobre el estado de su solicitud de vacaciones");

        res.status(200).json({ message: "Solicitud de vacaciones actualizada con éxito", updatedVacation });
         // Enviar correo al usuario sobre el estado de su solicitud
         sendVacationStatusEmail(updatedVacation);

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Solicitud de vacaciones no encontrada.' });
        }
        console.error("Error al actualizar solicitud de vacaciones:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }

}

async function getVacations(req, res) {
    try {   
        const vacations = await prisma.vacation.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                reviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        return res.status(200).json(vacations);
    } catch (error) {
        console.error("Error al obtener las solicitudes de vacaciones:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }}

    async function getMyVacations(req, res) {
        try {
            const userId = req.user.userId;
            const vacations = await prisma.vacation.findMany({
                where: { userId },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    reviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
                }
            });
            return res.status(200).json(vacations);
        } catch (error) {
            console.error("Error al obtener mis solicitudes de vacaciones:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

module.exports = { createVacation , updateVacation , getVacations , getMyVacations }; 