interface stockQuantityType{
    quantity:number;
    locked:number;
}
interface stockBalanceType{
    yes:stockQuantityType;
    no:stockQuantityType
}
interface symbolType{
    [symbol:string]:stockBalanceType;
}

export interface stockBalance {
    [userId:string]:symbolType;
}
export interface OnrampRequest{
    userId:string;
    amount:number;
}

export interface OrderRequestBody{
    userId:string;
    stockSymbol:string;
    quantity:number;
    price:number;
    stockType:"yes"|"no";
}