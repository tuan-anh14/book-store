interface IOrderTable {
    _id: string;
    name: string;
    address: string;
    phone: string;
    totalPrice: number;
    type: string;
    status: string;
    detail: Array<{
        bookName: string;
        quantity: number;
        _id: string;
    }>;
    createdAt: string;
} 