import express from 'express'
import multer from 'multer'
import prodsRouter from "./routes/products.routes.js";
import cartRouter from './routes/carts.routes.js';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';

import path from 'path';

const PORT = 4000
const app = express()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img') 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) 
    }
})


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', engine()) 
app.set('view engine', 'handlebars') 
app.set('views', path.resolve(__dirname, './views')) 
const upload = multer({ storage: storage })
app.use('/static', express.static(path.join(__dirname, '/public'))) 


app.use('/api/products', prodsRouter)
app.use('/api/carts', cartRouter)
app.get('/static', (req, res) => {
    const user = {
        nombre: "Santiago",
        cargo: "Estudiante"
    }

    const cursos = [
        { numCurso: 123, dia: "S", horario: "Tarde" },
        { numCurso: 456, dia: "MyJ", horario: "Noche" },
        { numCurso: 789, dia: "LyM", horario: "Mañana" }
    ]
    res.render('home', {
        user: user,
        css: "home.css",
        title: "Home",
        esEstudiante: user.cargo === "Estudiante",
        cursos: cursos
    })
})

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})