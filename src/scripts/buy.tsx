import Order from './order';

export default class Buy extends Order {
    orderType: 'BUY' | 'SELL';


    constructor(ticketSymbol: string, quantity: number, price: number) {
        super(ticketSymbol, quantity, price);
        this.orderType = 'BUY';
    }

    display(): string {
        return `BUY | ${this.ticketSymbol} | ${this.quantity} | ${this.price} | ${super.getTime()}`;
    }
}

