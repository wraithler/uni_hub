import api from "@/api/old/api.ts";
import { AxiosResponse } from "axios";
import { UserMe } from "../types/users.ts";

const fetchUserMe = async (): Promise<AxiosResponse<UserMe>> => {
  return await api.get("/auth/me/");
};

const fetchLogin = async (
  email: string,
  password: string,
): Promise<AxiosResponse> => {
  return await api.post("/auth/token/", { email, password });
};

const fetchRegister = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
): Promise<AxiosResponse> => {
    return await api.post("/users/create/", { first_name, last_name, email, password });
}

export { fetchUserMe, fetchLogin, fetchRegister };
