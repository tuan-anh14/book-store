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
  const urlBackend = "/api/v1/user/register";
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

//api bulk create

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
  const urlBackend = '/api/v1/database/category';
  return axios.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios<IBackendRes<{ fileUploaded: string }>>({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'upload-type': folder,
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
  slider: string[]
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