import redis from 'redis';

class redisHandler{
    private client: ReturnType<typeof redis.createClient>;
    private publisher: ReturnType<typeof redis.createClient>;
    private static instance: redisHandler;

    constructor(){
        this.client = redis.createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        });
        this.client.connect();
        this.publisher = redis.createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        });
        this.publisher.connect();
}
public static getInstance(){
    if(!this.instance){
        this.instance = new redisHandler();
    }
    return this.instance;
}
public pushAwait(id: string, data: any): Promise<{id:string,responseData:any}>{
return new Promise((resolve) => {
    this.client.subscribe(id, (message) => {
        this.client.unsubscribe(id);
        resolve(JSON.parse(message));
    });
    this.publisher.lPush("engine", JSON.stringify(data));
})
}
public pushToDBQueue(data:{type:string; data:any}){
    this.publisher.lPush("db", JSON.stringify(data));
}
}

export default redisHandler;
