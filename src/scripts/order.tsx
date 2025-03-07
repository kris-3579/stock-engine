
import Trade from './trade'
export default abstract class Order implements Trade {

  abstract orderType: 'BUY' |'SELL';
  ticketSymbol: string;
  quantity: number;
  price: number;
  time: string; // string representation of date

  constructor(ticketSymbol: string, quantity: number, price: number) {

    this.ticketSymbol = ticketSymbol;
    this.quantity = quantity;
    this.price = price;
    this.time = new Date().toLocaleString();
  }

  abstract display(): string;

  getTime(): string {return this.time};


}