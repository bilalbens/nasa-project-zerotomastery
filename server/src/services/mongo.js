const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://nasa-api:abcdefgh159753@nasacluster.jn6b6.mongodb.net/nasaDB?retryWrites=true&w=majority"


mongoose.connection.once("open", ()=>{                    //this mongoose.connection is an event emmiter that emit an event ('open') when the connection is ready or errors
    console.log('MongoDB connection ready!')
});

mongoose.connection.on("error", (err)=>{                    //this mongoose.connection is an event emmiter that emit an event ('error') when the connection is ready or errors
    console.error(err);
});


async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}
 


module.exports = {
    mongoConnect,
    mongoDisconnect

}