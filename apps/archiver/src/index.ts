import { OrderBook, Symbol } from "@repo/types/src";
import Redis from "ioredis"
import { subscribedChart } from "../store";
const redis = new Redis();

async function subscribeToChannel(channel: string): Promise<void> {
    redis.subscribe(channel, (err, count) => {
        if (err) {
            console.error(`Failed to subscribe to channel "${channel}":`, err);
            return;
        }
        console.log(`Subscribed to ${count} channel(s). Listening on "${channel}"...`);
    });
    redis.on('message', (channel: string, message: string) => {
        const data :OrderBook= JSON.parse(message)
       

        if(data){
          //send to db
        }
    })
}


subscribeToChannel(process.env.CHANNEL||"");
