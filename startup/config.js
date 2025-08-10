import config from "config";

export default function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR:jwtPrivateKey is not defined"); // if this happen in terminal-> export vidly_jwtPrivateKey=securityKey
  }
}
