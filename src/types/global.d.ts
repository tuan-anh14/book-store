export { };

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string | string[];
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    },
    result: T[]
  }

  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IRegister {
    _id: string,
    email: string,
    fullName: string
  }

  interface IAppContext {
    isAuthenticated: boolean;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }

  interface IFetchAccount {
    user: IUser
  }

  interface IUserTable {
    _id: string;
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

  }

  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICart {
    _id: string;
    quantity: number;
    detail: IBookTable;
  }

  interface IHistory {
    _id: string;
    name: string;
    type: string;
    email: string;
    phone: string;
    userId: string;
    detail: {
      bookName: string;
      quantity: number;
      _id: string;
    }[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IOrderTable extends IHistory {

  }

  interface ICategory {
    _id: string;
    name: string;
    updatedAt: string;
  }

  interface IResponseImport {
    countSuccess: number;
    countError: number;
    detail: any;
  }

  interface ICommentTable {
    _id: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
    };
    book: {
      _id: string;
      mainText: string;
    };
    content: string;
    star: number;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
