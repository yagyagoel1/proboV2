import { OrderBook, PriceLevel, responseType, stockBalance, userBalanceType } from '@repo/types';
import { redisHandler } from '../redisHandler';
export class engineHandler{
    private InrBalances:userBalanceType= {
        user5: {
          balance: 50000000,
          locked: 0,
        },
      };
      private  OrderBook: OrderBook = {};
      private Stock_Balance: stockBalance = {
        user5: {
            "BTC": {
              yes: {
                quantity: 400,
                locked: 0,
              },
              no: {
                quantity: 500,
                locked: 0,
              },
            },
          },}
          private static instance: engineHandler;
            public static getInstance(): engineHandler {
                if (!engineHandler.instance) {
                engineHandler.instance = new engineHandler();
                }
                return engineHandler.instance;
            }
            public processResponse(response :responseType){
                switch(response.type){
                    case "createUser":
                    this.createUser(response.data);
                    break;
                    case "onrampInr":
                    this.onrampMoney(response.data);
                     
                   break;
                    case "buyOrder":
                        const buyorderresult = this.buyOrder(response.data);
                        redisManager.getInstance().sendToApi(response.data.clientId, {
                          clientId: response.data.clientId,
                          responseData: buyorderresult,
                        });
                        redisManager.getInstance().publishMessage("order", {
                          eventId: response.data.stockSymbol,
                          data: this.ORDERBOOK[response.data.stockSymbol],
                        });
                        break;
                    break;
                    case "sellOrder":
                    this.sellOrder(response.data);
                    break;
                    case  "reset":
                        this.resetData(respnse.data);
                        break;
                    case "createSymbol":
                        this.createSymbol(response.data);
                        break;
                    case "tradeMint":
                        this.tradeMint(response.data);
                        break;
                    case "getInrBalance":
                        this.getInrBalance(response.data);
                        break;
                    case "getOrderBook":
                        this.getOrderBook(response.data);
                        break;
                    case "getStockOrderBook":
                        this.getStockOrderBook(response.data);
                        break;
                    case "checkBalance":
                        this.checkBalance(response.data);
                        break;
                    case "checkStockBalance":
                        this.checkStockBalance(response.data);
                        break;

            }
}
public createUser(userData:{clientId:string, userId:string}){
    try{
        if(this.InrBalances[userData.userId]){
            redisHandler.getInstance().pushToApi(userData.clientId, {
                clientId: userData.clientId,
                responseData: "User already exists",
            });
            return "user already exists";
        }
        const initialBalance = {
            balance:0,
            locked: 0,
        }
        this.InrBalances[userData.userId] = initialBalance;
        const data= {type:"createUser", data:{username:userData.userId}};
        redisHandler.getInstance().pushToDB(data);
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData: {
                msg:`User ${userData.userId} created successfully`,
                userBalance: this.InrBalances[userData.userId],
            },
        });
    }catch(err){
        console.error(err)
        throw new Error("error wjile creating user");
    }
}
public getStockOrderBook(userData:{clientId:string, stockSymbol:string}){
    try{
        if(!this.OrderBook[userData.stockSymbol]){
            redisHandler.getInstance().pushToApi(userData.clientId, {
                clientId: userData.clientId,
                responseData: "stock does not exist",
            });
        }
       
        const stockOrderbook = this.OrderBook[userData.stockSymbol];
        redisHandler.getInstance().pushToApi    (userData.clientId, {
            clientId: userData.clientId,
            responseData: stockOrderbook,
        });
    }catch(err){
        console.error(err)
        throw new Error("error wjile checking stock balance");
    }
}
public getOrderBook(userData:{clientId:string}){
    try{
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData:{orderbook: this.OrderBook},
        });
    }catch(err){
        console.error(err)
        throw new Error("error wjile getting order book");
    }   
}
public checkBalance(userData:{clientId:string}){
    try{
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData: this.InrBalances,
        });
    }catch(err){
        console.error(err)
        throw new Error("error wjile getting inr balance");
    }
}
public checkStockBalance(userData:{clientId:string,userId:string}){
    try{
        if(!this.Stock_Balance[userData.userId]){
            redisHandler.getInstance().pushToApi(userData.clientId, {
                clientId: userData.clientId,
                responseData:{message: "User does not exist"},
            });
        }
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData:{stockBalance: this.Stock_Balance[userData.userId]},
        });
    }catch(err){
        console.error(err)
        throw new Error("error wile checking stock balance");
    }
}

public resetData(userData:{clientId:string}){
    try{
        Object.keys(this.InrBalances).forEach((key)=>{
            delete this.InrBalances[key];
        })
        Object.keys(this.OrderBook).forEach((key)=>{
            delete this.OrderBook[key];
        })
        Object.keys(this.Stock_Balance).forEach((key)=>{
            delete this.Stock_Balance[key];
        })
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData: "Data reset successfully",
        });
    }catch(err){
        console.error(err)
        throw new Error("error wjile resetting data");
    }

}
public onrampMoney(userData:{clientId:string, userId:string, amount:number}){
    
        try{
            if(typeof userData.userId !== "string" ||
                typeof userData.amount !== "number" ||
                userData.amount <= 0
              ) {
                redisHandler.getInstance().pushToApi(userData.clientId, {
                    clientId: userData.clientId,
                    responseData: "Invalid Input. UserId must be a string and amount must be a positive number",
                });
              }

            if(!this.InrBalances[userData.userId]){
                redisHandler.getInstance().pushToApi(userData.clientId, {
                    clientId: userData.clientId,
                    responseData: "User does not exist",
                });
            }
            this.InrBalances[userData.userId].balance += userData.amount;
            redisHandler.getInstance().pushToApi(userData.clientId, {
                clientId: userData.clientId,
                responseData: {
                   message: `Onramped ${userData.userId} with amount ${userData.amount}.`,
                    balance: this.InrBalances[userData.userId],
                }
            });
        }catch(err){
            console.error(err)
            throw new Error("error wjile onramping money");
        }
    }
public createSymbol(userData:{clientId:string, stockSymbol:string}){
try{
    const yesOrderValues:Record<string,PriceLevel> = {};
    for (let i = 50; i <= 950; i += 50) {
        yesOrderValues[i] = { total: 0, orders: [] };
      }

      const noOrderValues: Record<string, PriceLevel> = {};
      for (let i = 50; i <= 950; i += 50) {
        noOrderValues[i] = { total: 0, orders: [] };
      }
      if(!this.OrderBook[userData.stockSymbol]){
          this.OrderBook[userData.stockSymbol] = {
              yes: yesOrderValues,
              no: noOrderValues,
          }
      }
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData: {message:`Stock ${userData.stockSymbol} created successfully`,
            orderBook: this.OrderBook[userData.stockSymbol],}
        });
    }catch(err){
        console.error(err)
        throw new Error("error while creating stock symbol");
    }
}
public tradeMint(userData:{clientId:string, userId:string, stockSymbol:string, quantity:number,price:number,stockType:"yes"|"no"}){
    try{
        if (
        !userData.userId ||
        !userData.stockSymbol ||
        !(userData.stockType=="yes"||userData.stockType=="no")||
        typeof userData.quantity !== "number" ||
        typeof userData.price !== "number"
      ) {
        redisHandler.getInstance().pushToApi(userData.clientId, {
          clientId: userData.clientId,
          responseData: "INVALID_DATA",
        });
        return;
      }
      const userId = userData.userId
      if(!this.InrBalances[userData.userId]){
          redisHandler.getInstance().pushToApi(userData.clientId, {
              clientId: userData.clientId,
              responseData: "User does not exist",
          });
      }
      const userBalance = this.InrBalances[userData.userId].balance;
      if(userBalance<userData.price*userData.quantity){
          redisHandler.getInstance().pushToApi(userData.clientId, {
              clientId: userData.clientId,
              responseData: "Insufficient balance",
          });
      }
      
      //create a complementory sell order (need to attach something to the sell order so we know its complementory)
      this.InrBalances[userData.userId].balance-= userData.price*userData.quantity
      this.InrBalances[userData.userId].locked+= userData.price*userData.quantity
      this.OrderBook[userData.stockSymbol] = this.OrderBook[userData.stockSymbol]||{}
      this.OrderBook[userData.stockSymbol][userData.stockType=="yes"?"no":"yes"] =this.OrderBook[userData.stockSymbol][userData.stockType=="yes"?"no":"yes"]||{}
      this.OrderBook[userData.stockSymbol][userData.stockType=="yes"?"no":"yes"][1000-userData.price]=this.OrderBook[userData.stockSymbol][userData.stockType=="yes"?"no":"yes"][1000-userData.price]|| { total: 0, orders: {} };
      this.OrderBook[userData.stockSymbol][userData.stockType=="yes"?"no":"yes"][1000-userData.price].total +=userData.quantity
      this.OrderBook[userData.stockSymbol][userData.stockType=="yes"?"no":"yes"][1000-userData.price].orders.push({userId:userId,quantity:userData.quantity,complementory:true})

      redisHandler.getInstance().pushToApi(userData.clientId, {
        clientId: userData.clientId,
        responseData: "Trade minted successfully",
      });
     
        
    }catch(err){
        console.error(err)
        throw new Error("error while minting stock");
    }
}
public sellOrder(userData:{clientId:string, userId:string, stockSymbol:string, quantity:number,price:number,stockType:"yes"|"no"}){
    try{
        //stock symbol stocktype quantity price 

        if (
            !userData.userId ||
            !userData.stockSymbol ||
            !(userData.stockType=="yes"||userData.stockType=="no")||
            typeof userData.quantity !== "number" ||
            typeof userData.price !== "number"
          ) {
            redisHandler.getInstance().pushToApi(userData.clientId, {
              clientId: userData.clientId,
              responseData: "INVALID_DATA",
            });
            return;
          }
          const userId = userData.userId
            if(!this.InrBalances[userData.userId]){
                redisHandler.getInstance().pushToApi(userData.clientId, {
                    clientId: userData.clientId,
                    responseData: "User does not exist",
                });
            }
        //check if user has enough stock balance
        if(this.Stock_Balance[userData.userId][userData.stockSymbol][userData.stockType].quantity<userData.quantity){
            redisHandler.getInstance().pushToApi(userData.clientId, {
                clientId: userData.clientId,
                responseData: "Insufficient balance",
            });
        }
        //create a sell order in the orderbook and lock the stock 
        this.Stock_Balance[userData.userId][userData.stockSymbol][userData.stockType].quantity-= userData.quantity
        this.Stock_Balance[userData.userId][userData.stockSymbol][userData.stockType].locked+= userData.quantity
        this.OrderBook[userData.stockSymbol] = this.OrderBook[userData.stockSymbol]||{}
        this.OrderBook[userData.stockSymbol][userData.stockType] =this.OrderBook[userData.stockSymbol][userData.stockType]||{}
        this.OrderBook[userData.stockSymbol][userData.stockType][userData.price]=this.OrderBook[userData.stockSymbol][userData.stockType][userData.price]|| { total: 0, orders: {} };
        this.OrderBook[userData.stockSymbol][userData.stockType][userData.price].total +=userData.quantity
        this.OrderBook[userData.stockSymbol][userData.stockType][userData.price].orders.push({userId:userId,quantity:userData.quantity,complementory:false})
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData: "Sell order placed successfully",
          });

    }catch(err){
        console.error(err)
        redisHandler.getInstance().pushToApi(userData.clientId, {
            clientId: userData.clientId,
            responseData: "Error while placing sell order",
          });
    }
}
}