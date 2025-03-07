import Order from './order';

export default class Sell extends Order {
    orderType: 'BUY' | 'SELL';

    constructor(ticketSymbol: string, quantity: number, price: number) {
        super(ticketSymbol, quantity, price);
        this.orderType = 'SELL';
    }

    display(): string {
        return `SELL | ${this.ticketSymbol} | ${this.quantity} | ${this.price} | ${super.getTime()}`;
    }
}


