require('./config/passport');
const express = require('express');
var session = require('express-session')
const passport = require('passport');
require("express-async-errors");
const errorHandler = require("./Middleware/errorHandler");

const userRoutes = require('./routes/userRouter');
const roleRoutes = require('./routes/roleRouter')
const roleUserRoutes = require('./routes/roleUserRouter')
const clientRoutes = require('./routes/clientRouter')
const projectRoutes = require('./routes/projectRouter')
const schedulingRoutes = require('./routes/schedulingRouter')
const pdfRouter = require('./routes/pdfRouter');



const app = express();

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));


app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true } // Para desenvolvimento, o 'secure' é false
}));

app.use(passport.initialize());
app.use(passport.session());


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}


app.use(express.json());

require('./auth');

app.get('/',(req,res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>')
});

app.get('/auth/google',
  passport.authenticate('google', {scope: ['email', 'profile']})
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/dashboard', // redireciona para o front-end
    failureRedirect: '/auth/failure'
  })
);

app.get('/auth/failure', (req,res) =>{
  res.send('Acesso não autorizado');  
}
)

app.get('/protected', isLoggedIn, (req, res) => {
  // Retorna os dados do usuário autenticado (deve estar na sessão)
  res.json({
    name: req.user.name,
    email: req.user.email,
    photo: req.user.photo 
  });
});

app.get('/logout', (req, res) => {
  req.logOut();
  req.session.destroy()
  res.send ('Xau')
})

// const cors = require('cors');

// app.use(cors({
//   origin: 'http://localhost:3000', // domínio do seu front-end
//   credentials: true // importante para permitir cookies
// }));

app.listen(5000,() => console.log('5000 para teste, 3331 para api '))




// Healthcheck (rota pública)
app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "Server on" });
});


app.use('/api', userRoutes);
app.use('/api' , roleRoutes)
app.use('/api' , roleUserRoutes)
app.use('/api', clientRoutes)
app.use('/api', projectRoutes)
app.use('/api', schedulingRoutes)
app.use('/api', pdfRouter);
// Middleware de erro
app.use(errorHandler);

module.exports = app;
