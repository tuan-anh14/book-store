import axios from 'services/axios.customize'

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login"
    return axios.post<IBackendRes<ILogin>>(urlBackend, {username, password}, {
        headers: {
            delay: 2000
        }
    })
}

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone }, {
        headers: {
            delay: 2000
        }
    });
  }

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
  }