import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { subscribedChart } from './store';
import { handleClient } from './handleClient';

const server = http.createServer();
const wss = new WebSocketServer({ server });
const PING_INTERVAL = 30000; 
const TIMEOUT_THRESHOLD = 5000;

export const clients =  new Map<WebSocket, { user: any; lastPing: number }>();
export interface customWebSocket extends WebSocket{
    isAuthenticated:boolean
}
wss.on('connection', function connection(ws:customWebSocket) {
    ws.isAuthenticated = false
    clients.set(ws, { user: null, lastPing: Date.now() });
    ws.on('message', async (message:string)=>{
       handleClient(message,ws)
    })
    ws.on('close', function close() {
        delete subscribedChart.user[clients.get(ws)?.user.userId]

        clients.delete(ws); 
    });
    ws.on('pong', () => {
        const clientData = clients.get(ws);
        if (clientData) {
            clientData.lastPing = Date.now();
            clients.set(ws, clientData);
        }
    });
})

setInterval(() => {

    wss.clients.forEach((ws: WebSocket) => {
        
        const clientData = clients.get(ws);
        
        if (clientData && Date.now() - clientData.lastPing > PING_INTERVAL + TIMEOUT_THRESHOLD) {
            const { user } = clientData;
            ws.terminate(); 
            delete subscribedChart.user[clients.get(ws)?.user.userId] 
            clients.delete(ws);

        } else {
            ws.ping(); 
        }
    });
}, PING_INTERVAL);


server.listen(3000, () => {
    console.log('WebSocket server is running on ws://localhost:3000');
});