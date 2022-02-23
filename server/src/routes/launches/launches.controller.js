
const {
        getAllLaunches,
        schedulewLaunch,
        existLaunchedWithId,
        abortLaunchById,
        
        } = require("../../models/launches.model")


async function httpGetAllLaunches(req,res){
        return  res.status(200).json(await getAllLaunches())

}


const httpAddNewLaunch = async (req,res)=>{
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: "Missing required lauch proprety",
        })
    }

    launch.launchDate = new Date(launch.launchDate)

    if(isNaN(launch.launchDate)) {   // or if(launch.launchDate.toString() === "Invalid Date")  //isNaN(x) return true if x is not a number  //isNaN(date) return seconde from 1/1/1970 
        return res.status(400).json({
            error: "Invalid launch Date",
        })
    }
    
    await schedulewLaunch(launch)

    return res.status(201).json(launch)  // status 201 : data created successfully
} 


const httpAbortLaunch =  async (req,res)=>{
    const launchId = Number(req.params.id)


    //if lauch doesn't exist 
    const existsLaunch = await existLaunchedWithId(launchId);
    if(!existsLaunch){
        return res.status(404).json({
            error:"Launch not found",
        })
    }

    //if lauch does exist 
    const aborted  = await abortLaunchById(launchId)
    if(!aborted){
            return res.status(400).json({
                error:"Launch not aborted",

            })
    }
    return res.status(200).json({
        ok:true

    })
}



module.exports = {  
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}