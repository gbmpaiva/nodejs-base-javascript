class ClientController {
    constructor(models) {
        this.Client = models.Client;
    }

    // Criar novo cliente (POST)
    async postClient(req, res) {
        try {
            const { name } = req.body;

            const newClient = await this.Client.create({
                name: name
            });

            return res.status(201).json(newClient);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Obter todos os clientes não deletados (GET ALL)
    async getAllClients(req, res) {
        try {
            // Parâmetros de paginação
            const page = parseInt(req.query.page, 10) || 1; // Página atual (default: 1)
            const pageSize = parseInt(req.query.pageSize, 10) || 10; // Itens por página (default: 10)
            const offset = (page - 1) * pageSize; // Cálculo do offset
    
            const clients = await this.Client.findAndCountAll({
                where: {
                    isDelete: false
                },
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: offset
            });
    
            return res.status(200).json({
                data: clients.rows,
                total: clients.count,
                page,
                pageSize,
                totalPages: Math.ceil(clients.count / pageSize)
            });
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Obter cliente por ID (GET BY ID)
    async getClientById(req, res) {
        try {
            const { id } = req.params;

            const client = await this.Client.findOne({
                where: {
                    id: id,
                    isDelete: false
                }
            });

            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            return res.status(200).json(client);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Soft delete (DELETE)
    async softDeleteClient(req, res) {
        try {
            const { id } = req.params;

            const client = await this.Client.findOne({
                where: {
                    id: id,
                    isDelete: false
                }
            });

            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado ou já removido' });
            }

            await client.update({ isDelete: true });

            return res.status(200).json({ message: 'Cliente marcado como removido' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ClientController;