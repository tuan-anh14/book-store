import axios from 'services/axios.customize'

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login"
  return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
    headers: {
      delay: 3000
    }
  })
}

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
  const urlBackend = "/api/v1/auth/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone }, {
  });
}

export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
  });
}

export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<IRegister>>(urlBackend);
}

export const getUsersAPI = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

export const createUserAPI = (fullName: string, email: string, password: string, phone: string) => {
  const urlBackend = `/api/v1/user`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone });
}

export const bulkCreateUserAPI = (data: {
  fullName: string;
  password: string;
  email: string;
  phone: string;
}[]) => {
  const urlBackend = "/api/v1/user/bulk-create";
  return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
};

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackend = `/api/v1/user`;
  return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone });
}

export const deleteUserAPI = (_id: string) => {
  const urlBackend = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
}

export const getBooksAPI = (query: string) => {
  const urlBackend = `api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
    headers: {
      delay: 2500,
    },
  });
}

export const getCategoryAPI = () => {
  const urlBackend = '/api/v1/category';
  return axios.get<IBackendRes<ICategory[]>>(urlBackend);
};

export const uploadFileAPI = (file: any, folderType: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileUpload', file);
  return axios<IBackendRes<{ fileName: string }>>({
    method: 'post',
    url: '/api/v1/files/upload',
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "folder_type": folderType
    },
  });
};

export const createBookAPI = (
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[],
  description: string
) => {
  const urlBackend = "/api/v1/book";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
    description
  });
};

export const getBookByIdAPI = (id: string) => {
  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const urlBackend = `/api/v1/book/${id}`;

  // Trả về Promise: delay 3s rồi mới gọi axios
  return delay(1500).then(() => axios.get<IBackendRes<IBookTable>>(urlBackend));
};

export const createOrderAPI = ({
  name,
  address,
  phone,
  totalPrice,
  type,
  detail,
}: {
  name: string;
  address: string;
  phone: string;
  totalPrice: number;
  type: string;
  detail: any;
}) => {
  const urlBackend = "/api/v1/order";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    name,
    address,
    phone,
    totalPrice,
    type,
    detail,
  });
};

export const getHistoryAPI = () => {
  const urlBackend = `/api/v1/history`;
  return axios.get<IBackendRes<IHistory>>(urlBackend);
}

export const updateUserInfoAPI = (
  _id: string, avatar: string,
  fullName: string, phone: string
) => {
  const urlBackend = "/api/v1/user/info";
  return axios.put<IBackendRes<IRegister>>(urlBackend, { fullName, phone, avatar, _id });
};

export const updateUserPasswordAPI = (
  email: string, oldpass: string, newpass: string
) => {
  const urlBackend = "/api/v1/user/change-password";
  return axios.post<IBackendRes<IRegister>>(urlBackend, { email, oldpass, newpass });
};

export const getOrdersAPI = (query: string) => {
  const urlBackend = `/api/v1/order?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};

export const getDashboardAPI = () => {
  const urlBackend = `/api/v1/dashboard`;
  return axios.get<IBackendRes<{
    countOrder: number;
    countUser: number;
    countBook: number;
  }>>(urlBackend);
};


export const getTotalRevenueAPI = () => {
  const urlBackend = `/api/v1/dashboard/revenue`;
  return axios.get<IBackendRes<{
    totalRevenue: number;
  }>>(urlBackend);
};

export const getOverallSalesAPI = () => {
  const urlBackend = `/api/v1/dashboard/sales`;
  return axios.get<IBackendRes<Array<{
    type: string;
    totalAmount: number;
    count: number;
  }>>>(urlBackend);
};

export const getOrdersByStatusAPI = () => {
  const urlBackend = `/api/v1/dashboard/orders/status`;
  return axios.get<IBackendRes<Array<{
    status: string;
    count: number;
  }>>>(urlBackend);
};

export const getCustomerReviewsAPI = () => {
  const urlBackend = `/api/v1/dashboard/reviews`;
  return axios.get<IBackendRes<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Array<{
      rating: number;
      count: number;
    }>;
  }>>(urlBackend);
};

export const getCategorySalesAPI = () => {
  const urlBackend = `/api/v1/dashboard/categories/sales`;
  return axios.get<IBackendRes<Array<{
    categoryId: string;
    categoryName: string;
    totalSales: number;
    totalBooks: number;
  }>>>(urlBackend);
};

export const createCategoryAPI = (name: string) => {
  return axios.post('/api/v1/category', { name });
};

export const updateCategoryAPI = (_id: string, name: string) => {
  return axios.patch(`/api/v1/category/${_id}`, { name });
};

export const deleteCategoryAPI = (_id: string) => {
  return axios.delete(`/api/v1/category/${_id}`);
};

export const bulkCreateBookAPI = (data: {
  mainText: string;
  author: string;
  category: string;
  price: number;
  description: string;
}[]) => {
  const urlBackend = "/api/v1/book/bulk-create";
  return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
};

export const updateBookAPI = (
  _id: string,
  mainText: string,
  author: string,
  price: number,
  category: string,
  description: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.patch<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    category,
    description,
    thumbnail,
    slider
  });
};

export const deleteBookAPI = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getCommentsByBookAPI = (bookId: string) => {
  return axios.get(`/api/v1/comment/book/${bookId}`);
};

export const createCommentAPI = (data: {
  content: string;
  user_id: string;
  book_id: string;
  star: number;
  images?: string[];
}) => {
  return axios.post('/api/v1/comment', data);
};

export const getAllCommentsAPI = (query: string) => {
  const urlBackend = `/api/v1/comment?${query}`;
  return axios.get<IBackendRes<IModelPaginate<ICommentTable>>>(urlBackend);
};

export const deleteCommentAPI = (_id: string) => {
  const urlBackend = `/api/v1/comment/${_id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};