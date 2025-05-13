const {Role} = require("../models")

class RoleController {
    async postRole(req, res) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Nome da função obrigatório" });
        }

    
        const roleAlreadyExists = await Role.findOne({ 
            where: { 
                name,
    
                isDelete: false 
            } 
        });

        if (roleAlreadyExists) {
            return res.status(400).json({ message: "Função já existe" });
        }

 
        const createdRole = await Role.create({ name });
        return res.status(201).json(createdRole); // 201 para recurso criado
    }

    async getAllRole(req,res){
        const roles = await Role.findAll({
            where:{
                isDelete : false
            }
        });
        return res.status(200).json(roles)
    }

    async softDeleteRole(req, res) { // Nome correto do método (ex: softDeleteRole)
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);

            if (!role) {
                return res.status(404).json({ message: "Perfil não encontrado" });
            }

            await Role.update({ isDelete: true }, { where: { id } });
            return res.status(200).json({ message: "Perfil marcado como excluído" });
        } catch (error) {
            console.error("Erro ao excluir perfil:", error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }
}

module.exports = new RoleController();
