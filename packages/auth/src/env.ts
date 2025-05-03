import { parseServerEnv } from "@galleo/env";

export const env = () => {
  return parseServerEnv(process.env);
};
