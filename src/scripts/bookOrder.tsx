import Buy from './buy';
import Sell from './sell';
import Trade from './trade';
import Order from './order';

export default class BookOrder implements Trade  {


  ticketSymbol: string;

  matchString: string = "";

  currentOrder: Order| null = null;




  buyOrders: Buy[] = [];
  sellOrders: Sell[] = [];


  constructor(ticketSymbol: string) {

    this.ticketSymbol = ticketSymbol;

  }



  addOrder(orderType: 'BUY' | 'SELL', ticketSymbol: string, quantity: number, price: number) {
    if(orderType === 'BUY') {
      
      let b = new Buy(ticketSymbol, quantity, price);
      this.buyOrders.push(b);

      this.currentOrder = b;


    }
    else if(orderType === 'SELL') {

      let s = new Sell(ticketSymbol, quantity, price);
      this.sellOrders.push(s);
      this.currentOrder = s;


    } else {

      throw new Error("Invalid orderType");
    }

   

    this.matchOrder();
    

    
    
  }


  // sources used to learn about match Order
  // https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/457218479/Supported+Matching+Algorithms
  // https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/matching-orders/#:~:text=Matching%20occurs%20when%20buy%20and,the%20sell%20order's%20minimum%20price
  // "The buy and sell orders are believed to be compatible if the buy order’s maximum price exceeds or equals the sell order’s minimum price. The compatible buy and sell orders are then prioritized using computerized systems for matching."
  // ^^^ First I will sort the buyOrders in descreasing order and the sellOrders in ascending order by time
  // FIFO algorthim is a price-time algorithim
  // Pro-rata utilizes price-and proportions
  // After writing matchOrder function last, I will implement a FIFO-similar algorithim and add a time component 
  matchOrder() {
    this.buyOrders.sort((a, b) => b.price - a.price);
    this.sellOrders.sort((a, b) => a.price - b.price);

    let pointerBuy = 0, pointerSell = 0;

    while (pointerBuy < this.buyOrders.length && pointerSell < this.sellOrders.length) {
        let buyOrder = this.buyOrders[pointerBuy];
        let sellOrder = this.sellOrders[pointerSell];

        if (buyOrder.price >= sellOrder.price) {
            let tradeQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);

            // Store "MATCH" before modifying the order quantities
            this.matchString  = `MATCH | ${buyOrder.ticketSymbol} | ${tradeQuantity} | ${sellOrder.price} | ${new Date().toLocaleString()} `;

            // Deduct traded quantity
            buyOrder.quantity -= tradeQuantity;
            sellOrder.quantity -= tradeQuantity;

            // Remove fully matched orders
            if (buyOrder.quantity === 0) {
                this.buyOrders.splice(pointerBuy, 1);
            } else {
                pointerBuy++;
            }

            if (sellOrder.quantity === 0) {
                this.sellOrders.splice(pointerSell, 1);
            } else {
                pointerSell++;
            }
        } else {
            break;
        }
    }

    this.buyOrders = this.buyOrders.slice(pointerBuy);
    this.sellOrders = this.sellOrders.slice(pointerSell);
}






  getTicketSymbol(): string {
    return this.ticketSymbol;
  }

  display(): string {

   return this.matchString;
}



}

