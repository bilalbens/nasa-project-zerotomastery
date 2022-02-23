const launchesDB = require("./launches.mongo")
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();

// let latestFlightNumber = 100

const  launch = {
    flightNumber: 100,
    mission:"Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target : "Kepler-442 b",
    customers: ['NASA', "ZTM"],
    upcoming: true,
    success:true,
}



const getLatestFlightNumber =  async ()=>{
    const latestLaunch = await launchesDB.findOne().sort('-flightNumber'); 

    if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

    return latestLaunch.flightNumber;
}





async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate({
      flightNumber: launch.flightNumber,
    }, launch, {
      upsert: true, 
    });
  }
  


// saveLaunch(launch)
// launches.set(launch.flightNumber, launch);

async function getAllLaunches(){
    // return Array.from(launches.values())
    return await launchesDB.find({},{'_id':0, "__v":0})
}






const existLaunchedWithId = async (launchId)=>{
    return await launchesDB.findOne({flightNumber: launchId})
}


// const   schedulewLaunch = async (launch)=>{
//     const newFlightNumber = await getLatestFlightNumber() + 1;
//     const newLaunch = Object.assign(launch,{
//             success:true,
//             upcoming: true,
//             customers:["ZTM","NASA"],
//             flightNumber: newFlightNumber,
//     });

//     await saveLaunch(newLaunch);
// }


async function schedulewLaunch(launch) {
    const planet = await planets.findOne({
      keplerName: launch.target,
    });
  
    if ( !planet) {
      throw new Error('No matching planet found');
    }
  
    const newFlightNumber = await getLatestFlightNumber() + 1;
  
    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: newFlightNumber,
    });
  
    await saveLaunch(newLaunch);
  }



// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success:true,
//             upcoming: true,
//             customers:["ZTM","NASA"],
//             flightNumber: latestFlightNumber
//         }),
//     )
// }



const abortLaunchById =  async (launchId)=>{

    const aborted =  await launchesDB.updateOne(
                {flightNumber: launchId},
                {
                    upcoming:false,
                    success:false
                }

            );

    return aborted.modifiedCount === 1;

    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}



module.exports = {
    existLaunchedWithId,
    getAllLaunches,
    schedulewLaunch,
    abortLaunchById,
}