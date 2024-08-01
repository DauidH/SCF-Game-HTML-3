const express = require("express")
const cors = require("cors") //libreria usada con express que facilita el tema de access control allow origin

const app = express()

app.use(cors()) // de esta manera usa la librería cors
app.use(express.json()) // con esto se activan peticiones que soporten JSON como parte de su cuerpo, para trabajar los post

const jugadores = [] //aquí van a aparecer la lista de jugadores cuando entren al host

class Jugador {
    constructor(id) {
        this.id = id
    }

    asignarMokepon(mokepon) {
        this.mokepon = mokepon
    }

    actualizarPosicion(x,y) {
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
    }
}

class Mokepon {
    constructor(nombre) {
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}` //cuando se unan les crea el id

    const jugador = new Jugador(id) //se instancia al jugador con la clase jugador en la const jugador, se manda como parametro al constructor el id

    jugadores.push(jugador) //se pushea en el array jugadores

    res.setHeader("Access-Control-Allow-Origin", "*")

    res.send(id) 
})

app.post("/mokepon/:jugadorId", (req, res) => { //los dos puntos son para definir variables en la url con express
    const jugadorId = req.params.jugadorId || "" // con params se accede a un contenido de req, y se puede acceder a las variables almacenadas en la url.
    const nombreMokeponFront = req.body.mokepon || "" // body porque viene en el body del JSON que se envió.
    const mokepon = new Mokepon(nombreMokeponFront) // se crea el mokepon en el backend

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) //va a comparar el id del front con los de la lista y devuelve un indice.

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMokepon(mokepon)
    }

/*     console.log(jugadores)
    console.log(jugadorId) */
    res.end() // con esto finalizo ya que el navegador se queda cargando por una respuesta.
}) 

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({
        enemigos
    })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => { 
    const jugadorId = req.params.jugadorId || "" 
    const ataques = req.body.ataques || [] 

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) 

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end() 
}) 

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(8080, () => {
    console.log("Servidor funcionando correctamente.")
})