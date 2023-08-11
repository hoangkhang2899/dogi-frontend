import dogiDriver from "services/dogi-driver";

export const getProfile = () => dogiDriver.get("/user/me");
