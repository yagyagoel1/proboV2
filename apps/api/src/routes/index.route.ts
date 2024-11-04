import { Router } from 'express'
import { buyOrder, checkBalance, checkStockBalance,
    createEvent, createSymbol, createUser,
    getInrBalance, getOrderBook, getStockOrderBook,
    onrampInr, sellOrder, tradeMint }
    from '../controller/index.controller'



const router:ReturnType<typeof Router> = Router()


router.post("/user/create/:userId",createUser)
router.post("/onramp/inr",onrampInr)
router.post("/event/create",createEvent)
router.post("/symbol/create/:stockSymbol",createSymbol)
router.post("/trade/mint",tradeMint)
router.post("/order/sell",sellOrder)
router.post("/order/buy",buyOrder)
router.get("/balance/inr",getInrBalance)
router.get("/orderbook",getOrderBook)
router.get("/orderbook/:stockSymbol",getStockOrderBook)
router.get("/balance/inr/:userId",checkBalance)
router.get("/balance/stock/:userId",checkStockBalance)



export default router