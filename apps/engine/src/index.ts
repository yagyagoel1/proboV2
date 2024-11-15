import {createClient} from 'redis';



const startEngine= async ()=>{
    const client = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    client.connect();
    client.on("error", (error:any) => {
        console.log(`error in redis connection ${error}`);
    });
    console.log("connected to redis");
    while(true){
        try{
            const response = await client.blPop("engine", 0);
            console.log("popped from engine", response?.element);
            engineManager.getInstance().processResponse(JSON.parse(response?.element));
            console.log("finished processing the data")
        }catch(error:any){
            console.log("error in processing data", error);
        }
    }
    client.subscribe("engine");
}