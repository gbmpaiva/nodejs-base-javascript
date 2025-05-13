const { Scheduling, User, Client, Project } = require("../models");
const { link } = require("../routes/schedulingRouter");
const { Op } = require("sequelize");

class SchedulingController {
    async postScheduling(req, res) {
        try {
            const { clientId, userId, projectId, title, date, hoursPreview, link } = req.body;

            if (!clientId || !userId || !projectId || !title || !date || !hoursPreview) {
                return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
            }

            const whereCondition = { clientId, userId, projectId, title, date, hoursPreview };

            const schedulingDeleted = await Scheduling.findOne({ where: { ...whereCondition, isDelete: true } });

            if (schedulingDeleted) {
                return res.status(400).json({ message: "Esse agendamento foi excluído anteriormente." });
            }

            const schedulingExists = await Scheduling.findOne({ where: { ...whereCondition, isDelete: false } });

            if (schedulingExists) {
                return res.status(400).json({ message: "Já existe um agendamento ativo com esses dados." });
            }

            const createdScheduling = await Scheduling.create({ clientId, userId, projectId, title, date, hoursPreview, link });

            const schedulingWithRelations = await Scheduling.findOne({
                where: { id: createdScheduling.id },
                include: [
                    { model: User, as: "user", attributes: ['id', 'name', 'email'] },
                    { model: Client, as: "client", attributes: ['id', 'name'] },
                    { model: Project, as: "project", attributes: ['id', 'name'] }
                ]
            });

            return res.status(201).json(schedulingWithRelations);

        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            return res.status(500).json({ message: "Erro ao criar agendamento." });
        }
    }

   async getAll(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { userId, clientId, projectId, date } = req.query;

        const where = {
            isDelete: false,
            isPointed: false
        };

        if (userId) {
            where.userId = userId;
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (projectId) {
            where.projectId = projectId;
        }

        if (date) {
            const dates = date.split(",");
            if (dates.length === 2) {
                where.date = {
                    [Op.between]: [dates[0], dates[1]]
                };
            } else {
                where.date = dates[0]; // Se for uma única data
            }
        }

        const { count, rows: schedulings } = await Scheduling.findAndCountAll({
            where,
            include: [
                { model: User, as: "user" },
                { model: Client, as: "client" },
                { model: Project, as: "project" }
            ],
            offset,
            limit,
        });

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            schedulings,
        });

    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
}

    async getByClient(req, res) {
        try {
            const { clientId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            if (!clientId) {
                return res.status(400).json({ message: "O parâmetro clientId é obrigatório." });
            }

            const { count, rows: schedulings } = await Scheduling.findAndCountAll({
                where: { clientId, isDelete: false, isPointed: false },
                offset,
                limit,
            });

            return res.status(200).json({
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                schedulings,
            });

        } catch (error) {
            console.error("Erro ao buscar agendamentos por cliente:", error);
            return res.status(500).json({ message: "Erro ao buscar agendamentos por cliente." });
        }
    }

    async getById(req, res) {
    try {
        const { id } = req.params; // alterado de req.query para req.params

        if (!id) {
            return res.status(400).json({ message: "O parâmetro ID é obrigatório." });
        }

        const schedule = await Scheduling.findOne({
            where: { id, isDelete: false },
            include: [
                { model: User, as: "user", attributes: ['id', 'name', 'email', 'isDelete', 'createdAt', 'updatedAt'] },
                { model: Client, as: "client", attributes: ['id', 'name', 'isDelete', 'createdAt', 'updatedAt'] },
                { model: Project, as: "project", attributes: ['id', 'name', 'clientId', 'totalHours', 'hoursSpent', 'hoursOver', 'createdAt', 'updatedAt'] }
            ]
        });

        if (!schedule) {
            return res.status(404).json({ message: "Agendamento não encontrado." });
        }

        return res.status(200).json(schedule);

    } catch (error) {
        console.error("Erro ao buscar agendamento por ID:", error);
        return res.status(500).json({ message: "Erro ao buscar agendamento." });
    }
}

async getAllPointed(req, res) {
     try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { userId, clientId, projectId, date } = req.query;

        const where = {
            isDelete: false,
            isPointed: true
        };

        if (userId) {
            where.userId = userId;
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (projectId) {
            where.projectId = projectId;
        }

        if (date) {
            const dates = date.split(",");
            if (dates.length === 2) {
                where.date = {
                    [Op.between]: [dates[0], dates[1]]
                };
            } else {
                where.date = dates[0]; // Se for uma única data
            }
        }

        const { count, rows: schedulings } = await Scheduling.findAndCountAll({
            where,
            include: [
                { model: User, as: "user" },
                { model: Client, as: "client" },
                { model: Project, as: "project" }
            ],
            offset,
            limit,
        });

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            schedulings,
        });

    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
}

async getAllPointed(req, res) {
     try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { userId, clientId, projectId, date } = req.query;

        const where = {
            isDelete: false,
            isPointed: true
        };

        if (userId) {
            where.userId = userId;
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (projectId) {
            where.projectId = projectId;
        }

        if (date) {
            const dates = date.split(",");
            if (dates.length === 2) {
                where.date = {
                    [Op.between]: [dates[0], dates[1]]
                };
            } else {
                where.date = dates[0]; // Se for uma única data
            }
        }

        const { count, rows: schedulings } = await Scheduling.findAndCountAll({
            where,
            include: [
                { model: User, as: "user" },
                { model: Client, as: "client" },
                { model: Project, as: "project" }
            ],
            offset,
            limit,
        });

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            schedulings,
        });

    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
}

async getAllSchedulings(req, res) {
     try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { userId, clientId, projectId, date } = req.query;

        const where = {
            isDelete: false
        };

        if (userId) {
            where.userId = userId;
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (projectId) {
            where.projectId = projectId;
        }

        if (date) {
            const dates = date.split(",");
            if (dates.length === 2) {
                where.date = {
                    [Op.between]: [dates[0], dates[1]]
                };
            } else {
                where.date = dates[0]; // Se for uma única data
            }
        }

        const { count, rows: schedulings } = await Scheduling.findAndCountAll({
            where,
            include: [
                { model: User, as: "user" },
                { model: Client, as: "client" },
                { model: Project, as: "project" }
            ],
            offset,
            limit,
        });

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            schedulings,
        });

    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
}

    async putSchedulingApontamento(req, res) {
    try {
        const { id, hoursReal, break: breakTime, notes } = req.body;

        if (!id || hoursReal == null || breakTime == null || notes == null) {
            return res.status(400).json({ message: "Todos os campos (id, hoursReal, break, notes) são obrigatórios." });
        }

        const schedule = await Scheduling.findByPk(id);

        if (!schedule || schedule.isDelete) {
            return res.status(404).json({ message: "Agendamento não encontrado ou já excluído." });
        }

        // 🔒 Validação: se já foi apontado, impedir nova soma
        if (schedule.isPointed) {
            return res.status(400).json({ message: "Este agendamento já foi apontado anteriormente." });
        }

        // Atualiza o apontamento
        schedule.hoursReal = hoursReal;
        schedule.break = breakTime;
        schedule.notes = notes;
        schedule.isPointed = true; // Marca como apontado
        await schedule.save();

        // ✅ Atualiza o projeto com as horas apontadas
        const project = await Project.findByPk(schedule.projectId);

        if (!project) {
            return res.status(404).json({ message: "Projeto associado não encontrado." });
        }

        const novaHoursSpent = parseFloat(project.hoursSpent || 0) + parseFloat(hoursReal);
        const excedente = Math.max(0, novaHoursSpent - parseFloat(project.totalHours || 0));

        await project.update({
            hoursSpent: novaHoursSpent,
            hoursOver: excedente
        });

        return res.status(200).json({ message: "Apontamento realizado com sucesso.", schedule });

    } catch (error) {
        console.error("Erro ao atualizar apontamento:", error);
        return res.status(500).json({ message: "Erro ao atualizar apontamento." });
    }
}


    async softDeleteScheduling(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "O parâmetro ID é obrigatório." });
            }

            const schedule = await Scheduling.findByPk(id);

            if (!schedule) {
                return res.status(404).json({ message: "Agendamento não encontrado." });
            }

            await schedule.update({ isDelete: true });

            return res.status(200).json({ message: "Agendamento excluído logicamente com sucesso." });

        } catch (error) {
            console.error("Erro ao excluir agendamento:", error);
            return res.status(500).json({ message: "Erro ao excluir agendamento." });
        }
    }
}

module.exports = new SchedulingController();
