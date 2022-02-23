const fs = require('fs');
const path = require('path')
const {parse} = require("csv-parse");


const planets = require("./planets.mongo")

const habitablePlanet=[];


function isHabitablePlanet(planet){
    return (planet['koi_disposition'] === 'CONFIRMED' 
            && planet['koi_insol'] > 0.36 
            && planet['koi_insol'] < 1.1
            && planet['koi_prad'] < 1.6); 
}


/*
    const promise = new Promise((resolve, reject)=>{
        resolve(42)
    });

    promise.then((result)=>{            //here result = 42

    });

    ---or we can do 

    cons result = await promise;
    console.log(result)

*/ 





//we call this function before the server start listenning in server.js because we need to load planets before we start receiving requests
function loadPlanetsData(){
    return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname, '..','..','data','kepler_data.csv'))
        .pipe(parse({
            comment:'#',
            columns: true
        }))
        .on('data', async(data) =>{
              if(isHabitablePlanet(data)){
                //   habitablePlanet.push(data);
                savePlanet(data)
              }
        })
        .on('error', (error) =>{
          console.log(error);
          reject(err) // reject in case of error
      })
        .on('end', async () =>{
            const countPlanetsFaund = (await getAllPlanets()).length
            console.log(`${countPlanetsFaund} habitable planets found`)

            resolve(); // we are not passing a result "habitablePlanet" in resolve bz we use promise just to load data and it stored in the array 
        });
    });
}


const getAllPlanets = async ()=>{
        return await planets.find({},{"_id":0, "__v":0});    
}

const savePlanet = async (planet)=>{
    try {
        //insert + update = upsert
        await planets.updateOne({
            keplerName: planet.kepler_name
        },{
            keplerName: planet.kepler_name
        },{
            upsert:true
        })
    } catch (error) {
        console.error(`Could not save planet ${error}`)
    }
    
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}