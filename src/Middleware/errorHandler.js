// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error("Erro interno:", err); // Para logs no terminal

    // Verifica se estamos em ambiente de desenvolvimento
    if (process.env.NODE_ENV === "development") {
        // Se for um erro do Sequelize (ou qualquer erro de validação)
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Erro de validação",
                details: err.errors.map(e => e.message) // Mensagens de erro detalhadas
            });
        }

        // Em dev, retorna o erro completo para facilitar o debug
        return res.status(500).json({
            message: "Erro interno do servidor",
            error: err.message,
            stack: err.stack // Detalhes do stack para o dev
        });
    }

    // Em produção, retorna apenas uma mensagem genérica
    return res.status(500).json({
        message: "Erro interno do servidor"
    });
}

module.exports = errorHandler;
