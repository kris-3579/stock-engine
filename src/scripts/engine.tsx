import stocks from './JSON/structured_company_stocks.json';
import BookOrder from './bookOrder';
import Order from './order';

const NUMSTOCKS = 4;

class Engine {
    books: BookOrder[] = [];
    currentOrder: Order | null = null;
    matchString: string = '';

    addBook(buyOrSell: 'BUY' | 'SELL', ticketSymbol: string, quantity: number, price: number) {
        for (let b of this.books) {
            if (b.getTicketSymbol() === ticketSymbol) {return b;}
        }

        let bookOrder = new BookOrder(ticketSymbol);
        
        
        this.books.push(bookOrder);
        return bookOrder;
    }

    run() {
        setInterval(() => {
            let randomStock = Math.floor(Math.random() * NUMSTOCKS);
            let ticketSymbol = Object.keys(stocks)[randomStock];
            let buyOrSell: 'BUY' | 'SELL' = Math.random() >= 0.5 ? 'BUY' : 'SELL';
            let quantity = Math.floor(Math.random() * 50) + 1;
            let price = Number((Math.random() * 500 + 1).toFixed(2));

            let book = this.addBook(buyOrSell, ticketSymbol, quantity, price);
            book.addOrder(buyOrSell, ticketSymbol, quantity, price);
            this.currentOrder = book.currentOrder;
            // Ensure `matchString` is properly set
            if (book.matchString !== "") {
                this.matchString = book.matchString;
            }

        }, 100);
    }
}

export let engine = new Engine();
engine.run();

