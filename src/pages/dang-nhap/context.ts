import dogiDriver from "services/dogi-driver";

type LoginResponse = {
  userInfo: {
    username: string;
    fullname: string;
    role: string;
  };
  accessToken: string;
};

export const login = (username: string, password: string) => {
  const dto = { username, password };
  return dogiDriver.post<LoginResponse>("/user/login", dto);
};
