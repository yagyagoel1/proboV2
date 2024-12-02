import Websocket from "ws"

export let subscribedChart:{
    user:{[userId:string]:{
        websocket:Websocket
        subscribedTo:string 
    }
}
token:Array<string>

    
}