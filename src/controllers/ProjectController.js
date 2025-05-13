const { Project } = require('../models'); // Ajuste o caminho conforme necessário

const projectController = {
  // Get all projects
 async getAll(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;

    // 1. Inicializar objeto where
    const where = { 
      isDelete: false 
    };

    // 2. Filtrar por clientId se existir
    const { clientId } = req.query;
    if (clientId) {
      where.clientId = clientId;
    }

    // 3. Usar objeto where na consulta
    const projects = await Project.findAndCountAll({
      where, // ✅ Objeto correto com ambos filtros
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: offset
    });

    return res.status(200).json({
      data: projects.rows,
      total: projects.count,
      page,
      pageSize,
      totalPages: Math.ceil(projects.count / pageSize)
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  },

  // Get projects by clientId
  async getByClientId(req, res) {
    try {
      const projects = await Project.findAll({
        where: { clientId: req.params.clientId }
      });
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      await project.destroy(); 
      res.status(204).send(); 
    } catch (error) {
      res.status(403).json({ error: "Não pode realizar delete e nem alterar um projeto já com agendamento" });
    }
  },

  // Create new project (POST)
  async create(req, res) {
    try {
      const { name, clientId, totalHours, hoursSpent, hoursOver } = req.body;
      
      if (!name || !clientId || !totalHours) {
        return res.status(400).json({ error: 'Name and clientId are required' });
      }

      const newProject = await Project.create({
        name,
        clientId,
        totalHours: totalHours || 0,
        hoursSpent: hoursSpent || 0,
        hoursOver: hoursOver || 0,
        isDelete: false
      });

      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = projectController;