export interface IHistory {
    _id: string;
    name: string;
    email: string;
    phone: string;
    userId: string;
    detail: Array<{
        bookName: string;
        quantity: number;
        _id: string;
    }>;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
} 