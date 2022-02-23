const http = require("http");
const app = require("./app");

const {loadPlanetsData} = require("./models/planets.model")
const { mongoConnect} = require("./services/mongo")


const server = http.createServer(app);
const PORT = process.env.PORT || 8000;



async function startServer(){
    
    await mongoConnect()

    await loadPlanetsData();

    server.listen(PORT, ()=>{
        console.log(`listening on port ${PORT}...`)
    });
}

startServer();


//sudo lsof -i :8000 :to know which process is using port 8000
//kill -9 {PID}