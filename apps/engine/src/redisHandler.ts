import { DBmessage, messageToApi, WsMessage } from "@repo/types";
import redis from "redis"
import {v4 as uuidv4} from 'uuid';
import { engineHandler } from "./store";
export class redisHandler{
    private client : ReturnType<typeof redis.createClient>;
    private static instance:redisHandler;
    constructor(){
        this.client = redis.createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        });
        this.client.connect();
    }
    public static getInstance(): redisHandler {
        if (!redisHandler.instance) {
            redisHandler.instance = new redisHandler();
        }
        return redisHandler.instance;
    }
    public pushToDB(message:DBmessage){
        this.client.lPush("db", JSON.stringify(message));
    }
    public publishMessage(channel:string, message: WsMessage){
        this.client.publish(channel, JSON.stringify(message));
    }
    public pushToApi(clientId:string,message:messageToApi){
        this.client.publish(clientId,JSON.stringify(message));

   
}
}

async function publishMessage(channel: string, message: string): Promise<void> {
    try {
      await redisHandler.getInstance().publishMessage(channel,{eventId:uuidv4() ,data:message})
        console.log(`Message published to channel "${channel}": ${message}`);
    } catch (err) {
        console.error('Error publishing message:', err);
    }
}

setInterval(() => {
    publishMessage(process.env.WEBSOCKETCHANNEL||"",JSON.stringify( engineHandler.getInstance().OrderBook)).catch((err) => console.error(err));
}, 5000);