
export {};

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
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
