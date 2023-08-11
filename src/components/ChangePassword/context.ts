import dogiDriver from "services/dogi-driver";

export const changePassword = (oldPassword: string, newPassword: string) => {
  return dogiDriver.post("/user/change-password", { oldPassword, newPassword });
};
