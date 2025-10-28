// import fs from "fs"
//import fs from "fs/promises"


// const data = await fs.readFile("info.txt", { encoding: "utf-8" })
//console.log (data)

//fs.writeFile(",mensajes.txt", "primer mensaje de prueba")



import http from "http"


const servidor = http.createServer()// Este es mi servidor

const puerto = 8080


servidor.on("request", (req, res) => {
    console.log(req.url)
    console.log(req.method)
    // req : request : solicitud
    // res : response : respuesta
    console.log ("Solicitud Recibida")
    res.end ("Hola mundo")
})

servidor.listen(puerto, () => {
    console.log('Servidor corriendo en el puerto ',{puerto})
})

