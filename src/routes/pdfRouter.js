// routes/pdfRouter.js
const express = require('express');
const React = require('react');
const {
  renderToStream,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} = require('@react-pdf/renderer');
// Modelos Sequelize
const { Scheduling, User, Client, Project } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Estilos para o PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, backgroundColor: '#ffffff' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 40, marginRight: 20 },
  title: { fontSize: 18, marginBottom: 5, fontWeight: 'bold' },
  subtitle: { fontSize: 10 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#d3d3d3' },
  tableRow: { flexDirection: 'row' },
  tableCellHeader: { backgroundColor: '#f0f0f0', padding: 5, fontWeight: 'bold', borderRightWidth: 1, borderColor: '#d3d3d3', flex: 1 },
  tableCell: { padding: 5, borderRightWidth: 1, borderColor: '#d3d3d3', flex: 1 },
  footer: { marginTop: 30, textAlign: 'center', fontSize: 10, color: '#555' },
});

// Componente PDF sem JSX
function ListDocument({ schedulings }) {
  const logoPath = 'src/assets/hvlogo.png';

  // Calcular totais
  const totalHorasPrevistas = schedulings.reduce((sum, s) => sum + (s.hoursPreview || 0), 0);
  const totalHorasApontadas = schedulings.reduce((sum, s) => sum + (s.hoursReal || 0), 0);

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Cabeçalho
      React.createElement(View, { style: styles.headerContainer },
        React.createElement(Image, { src: logoPath, style: styles.logo }),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.title }, 'Lista de Agendamentos'),
          React.createElement(Text, { style: styles.subtitle }, `Gerado em: ${new Date().toLocaleString('pt-BR')}`)
        )
      ),

      // Tabela
      React.createElement(View, { style: [styles.table, { marginTop: 0 }] },
        React.createElement(View, { style: styles.tableRow },
          ['Data', 'Título', 'Cliente', 'Projeto', 'Analista', 'Horas        Previstas', 'Horas Apontadas']
            .map(header => React.createElement(Text, { key: header, style: styles.tableCellHeader }, header))
        ),
        schedulings.map(s => React.createElement(View, { style: styles.tableRow, key: s.id },
          React.createElement(Text, { style: styles.tableCell }, new Date(s.date).toLocaleDateString('pt-BR')),
          React.createElement(Text, { style: styles.tableCell }, s.title),
          React.createElement(Text, { style: styles.tableCell }, s.client.name),
          React.createElement(Text, { style: styles.tableCell }, s.project.name),
          React.createElement(Text, { style: styles.tableCell }, s.user.name),
          React.createElement(Text, { style: styles.tableCell }, String(s.hoursPreview)),
          React.createElement(Text, { style: styles.tableCell }, String(s.hoursReal))
        ))
      ),

      // Rodapé com totais
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, null, `Total: ${schedulings.length} agendamentos`),
        React.createElement(Text, null, `Horas Previstas: ${totalHorasPrevistas.toFixed(2)} h`),
        React.createElement(Text, null, `Horas Apontadas: ${totalHorasApontadas.toFixed(2)} h`)
      )
    )
  );
}

// Rota GET /api/schedulings/list/pdf
router.get('/schedulings/list/pdf', async (req, res, next) => {
  try {
    const { userId, clientId, projectId, date } = req.query;
    const where = { isDelete: false, isPointed: false };
    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;
    if (date) {
      const dates = date.split(',');
      where.date = dates.length === 2
        ? { [Op.between]: [dates[0], dates[1]] }
        : dates[0];
    }

    // Buscar todos os agendamentos filtrados
    const schedulings = await Scheduling.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [['date', 'ASC']],
    });

    // Gerar stream PDF
    const pdfStream = await renderToStream(
      React.createElement(ListDocument, { schedulings })
    );

    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.get('/schedulings/list/pointed/pdf', async (req, res, next) => {
  try {
    const { userId, clientId, projectId, date } = req.query;
    const where = { isDelete: false, isPointed: true };
    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;
    if (date) {
      const dates = date.split(',');
      where.date = dates.length === 2
        ? { [Op.between]: [dates[0], dates[1]] }
        : dates[0];
    }

    // Buscar todos os agendamentos filtrados
    const schedulings = await Scheduling.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [['date', 'ASC']],
    });

    // Gerar stream PDF
    const pdfStream = await renderToStream(
      React.createElement(ListDocument, { schedulings })
    );

    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
  } catch (error) {
    next(error);
  }
});


router.get('/schedulings/list/all/pdf', async (req, res, next) => {
  try {
    const { userId, clientId, projectId, date } = req.query;
    const where = { isDelete: false };
    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;
    if (date) {
      const dates = date.split(',');
      where.date = dates.length === 2
        ? { [Op.between]: [dates[0], dates[1]] }
        : dates[0];
    }

    // Buscar todos os agendamentos filtrados
    const schedulings = await Scheduling.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [['date', 'ASC']],
    });

    // Gerar stream PDF
    const pdfStream = await renderToStream(
      React.createElement(ListDocument, { schedulings })
    );

    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;