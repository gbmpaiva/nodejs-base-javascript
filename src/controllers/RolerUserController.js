const { RoleUser } = require("../models");

class RoleUserController {
    async postRoleUser(req, res) {
        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            return res.status(400).json({ message: "Usuário ou Função não preenchidas" });
        }

        // Correção 1: Usar 'where' minúsculo e verificar soft delete
        const roleUserAlreadyExists = await RoleUser.findOne({ 
            where: { 
                userId, 
                roleId,
                isDelete: false // Considerar apenas registros não excluídos
            } 
        });

        if (roleUserAlreadyExists) {
            return res.status(400).json({ message: "Essa atribuição já foi feita" });
        }

        const createdRoleUser = await RoleUser.create({ userId, roleId });
        return res.status(201).json(createdRoleUser);
    }

    async getAll(req, res) {
        
        const roleusers = await RoleUser.findAll({ 
            where: { 
                isDelete: false 
            } 
        });
        return res.status(200).json(roleusers);
    }

    async softDeleteRoleUser(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }

            const roleUser = await RoleUser.findByPk(id);

          
            if (!roleUser) {
                return res.status(404).json({ message: "Atribuição não encontrada" });
            }

            await roleUser.update({ isDelete: true });

            return res.status(200).json({ message: "Atribuição marcada como excluída" });

        } catch (error) {
            console.error("Erro ao excluir atribuição:", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

module.exports = new RoleUserController();