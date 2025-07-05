import { config } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
function verifyTokenForWebSocket(token: string): Promise<JwtPayload | null> {
  return new Promise((resolve) => {
    if (!token) {
      resolve(null);
      return;
    }

    jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
      if (err || !decoded) {
        resolve(null);
        return;
      }
      resolve(decoded as JwtPayload);
    });
  });
}

export { verifyTokenForWebSocket };