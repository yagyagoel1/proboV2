export interface Order{
    quantity:number;
    userId:string;
    complementory:boolean
}
export interface PriceLevel{
    total:number;
    orders:Order[];
}

interface TokenType{
    [price:string]:PriceLevel;
}
export interface Symbol{
    yes:TokenType,
    no:TokenType,
}
export interface OrderBook{
    [symbol:string]:Symbol;
}