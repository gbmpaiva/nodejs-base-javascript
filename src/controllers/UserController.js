const { Scheduling, User, Client, Project } = require('../models');

class UserController {
    async postUser(req, res) {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Nome e email são obrigatórios" });
        }

        const userAlreadyExists = await User.findOne({ where: { email } });

        if (userAlreadyExists) {
            return res.status(400).json({ message: "Esse usuário já existe" });
        }

        const createdUser = await User.create({ name, email });
        return res.status(201).json(createdUser);
    }

    async getAll(req, res) {
      try {
          const page = parseInt(req.query.page) || 1; // Página atual (default: 1)
          const limit = parseInt(req.query.limit) || 10; // Itens por página (default: 10)
          const offset = (page - 1) * limit;
  
          const { count, rows: users } = await User.findAndCountAll({
              where: { isDelete: false }, // Se estiver usando soft delete
              offset,
              limit,
          });
  
          return res.status(200).json({
              totalItems: count,
              totalPages: Math.ceil(count / limit),
              currentPage: page,
              users,
          });
      } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          return res.status(500).json({ message: "Erro interno do servidor" });
      }
  }

    async getByEmail(req, res) {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email é obrigatório" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json(user);
    }

    async softDeleteUser(req, res) {
        try {
          const { id } = req.params;
    
          if (!id) {
            return res.status(400).json({ message: "ID é obrigatório" });
          }
    
          const user = await User.findByPk(id);
    
          if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
          }
    
          await User.update({ isDelete: true }, { where: { id } });
    
          return res.status(200).json({ message: "Usuário marcado como excluído" });
    
        } catch (error) {
          console.error("Erro ao marcar usuário como excluído:", error);
          return res.status(500).json({ message: "Erro interno do servidor" });
        }
      }
        }


module.exports = new UserController();
