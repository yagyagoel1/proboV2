
import jwt from "jsonwebtoken"
import { clients, customWebSocket } from ".";
import { subscribedChart } from "./store";






export function handleClient(message:string,ws:customWebSocket){
    const data = JSON.parse(message);
       if(data.type=="authentication"){
        const { token } = data;
         try{
            const payload  =  jwt.verify(token, process.env.TOKEN||"");
            ws.isAuthenticated = true
            clients.set(ws,{user:payload,lastPing: Date.now()})
         }catch(err){
            console.log(err)
            ws.send(JSON.stringify({ type: 'authenticated', success: false, error: 'Invalid token' }));
            ws.close()
        }
       }
       else if (ws.isAuthenticated){
        if(data.type=="subscribe"){
        const user = clients.get(ws)?.user
        if(user){
            if(data.token){
                if(subscribedChart.token.includes(data.token)){
                    subscribedChart.user[user.userId] = {
                        websocket:ws,
                        subscribedTo:data.token
                    }
                    ws.send(JSON.stringify({
                        type:"Subscribed",
                        success:true,
                        message:`subscribed to the ${data.token}`
                    }))
                }
            }
        }
        ws.send(JSON.stringify({
            type:"failedSub",
            success:false,
            message:`failed to subscribe to the ${data.token}`
        }))
       }
      else if(data.type=="unsubscribed"){
        const user = clients.get(ws)?.user
        if(user){
        delete subscribedChart.user[user.userId]
       }
       ws.send(JSON.stringify({type:"UnSubscribed",success:true,message:`unsub the user`}))
    }
    else {
        ws.send(JSON.stringify({
            success:false,
            type:"InvalidType",
            message:null
        }))
    }

}
    else{
        ws.send(JSON.stringify({
            type:"unauthorized",
            success:false,
            message:"failed to authenticate"
        }))
    }
}