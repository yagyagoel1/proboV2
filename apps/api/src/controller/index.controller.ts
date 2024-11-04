import {v4 as uuidv4} from 'uuid';
import { Request, Response } from 'express';
import redisHandler from '../redisHandler';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const clientId = uuidv4();

        const data = {
            type:"createUser",
            data: {
                userId,
                clientId
            }
        }
        const response =await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(201).json({response :response.responseData});
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
export const onrampInr = async (req: Request, res: Response) => {
    try {
        const { userId, amount } = req.body;
        const clientId = uuidv4();
        const data = {
          type: "onrampInr",
          data: {
            clientId: clientId,
            userId: userId,
            amount: amount,
          },
        };
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({ response: response.responseData });

    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
export const createEvent = async (req: Request, res: Response) => {   
    try{
        const clientId = uuidv4();
         const {symbol ,endtime,description ,source_of_truth,categoryId} = req.body;
            const data = {
                type: "createSymbol",
                data: {
                    clientId: clientId,
                    stockSymbol: symbol,
                }
            };
            redisHandler.getInstance().pushToDBQueue({type:"createMarket",data:{symbol,endtime,description,source_of_truth,categoryId}});
            const response = await redisHandler.getInstance().pushAwait(clientId, data);
            res.status(201).json({response: response.responseData});

    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}

export  const createSymbol = async (req: Request, res: Response) => {
    try {
        const { stockSymbol } = req.params;
        const clientId = uuidv4();
        const data = {
            type: "createSymbol",
            data: {
                clientId: clientId,
                stockSymbol: stockSymbol,
            }
        };
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(201).json({ response: response.responseData });

    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
export const tradeMint = async (req: Request, res: Response) => {
    try {
        const { userId, stockSymbol,quantity,price } = req.body;
        const clientId = uuidv4();
        const data = {
            type: "tradeMint",
            data: {
                clientId: clientId,
        userId: userId,
        stockSymbol,
        quantity,
        price,
            },
        };
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({ response: response.responseData });

    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
export const sellOrder = async (req: Request, res: Response) => {
    try {
        const { userId, stockSymbol,quantity,price,stockType } = req.body;
        const clientId = uuidv4();
        const data = {
            type: "sellOrder",
            data: {
                clientId: clientId,
        userId: userId,
        stockSymbol,
        quantity,
        price,
        stockType
            },
        };
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({ response: response.responseData });

    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}

export const buyOrder = async (req: Request, res: Response) => {
    try {
        const { userId, stockSymbol,quantity,price,stockType } = req.body;
        const clientId = uuidv4();
        const data = {
            type: "buyOrder",
            data: {
                clientId: clientId,
        userId: userId,
        stockSymbol,
        quantity,
        price,
        stockType
            },
        };
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({ response: response.responseData });

    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
export const getInrBalance = async (req: Request, res: Response) => {
    try{
        const clientId = uuidv4();
        const data={
            type:"getInrBalance",
            data:{
                clientId:clientId,
            }

        }
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({response:response.responseData});

    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}

export const getOrderBook =  async (req: Request, res: Response) => {
    try{
        const clientId = uuidv4();
        const data={
            type:"getOrderBook",
            data:{
                clientId:clientId,
            }
        }
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({response:response.responseData});
    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}

export const getStockOrderBook = async (req: Request, res: Response) => {
    try{
        const clientId = uuidv4();
        const {stockSymbol} = req.params;
        const data={
            type:"getStockOrderBook",
            data:{
                clientId:clientId,
                symbol:stockSymbol,
            }
        }
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({response:response.responseData});
    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}

export const checkBalance = async (req: Request, res: Response) => {
    try{
        const clientId = uuidv4();
        const {userId} = req.params;
        const data={
            type:"checkBalance",
            data:{
                clientId:clientId,
                userId:userId,
            }
        }
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({response:response.responseData});
    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}   
export const checkStockBalance = async (req: Request, res: Response) => {
    try{
        const clientId = uuidv4();
        const {userId} = req.params;
        const data={
            type:"checkStockBalance",
            data:{
                clientId:clientId,
                userId:userId,
            }
        }
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({response:response.responseData});
    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}
export const reset = async (req: Request, res: Response) => {
    try{
        const clientId = uuidv4();
        const data={
            type:"reset",
            data:{
                clientId:clientId,
            }
        }
        const response = await redisHandler.getInstance().pushAwait(clientId, data);
        res.status(200).json({response:response.responseData});
    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}