import config from "config";
import { get } from "lodash";
import { Request, Response } from "express";
import { createAccessToken, createSession, updateSession, findSessions } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { UserDocument } from "../model/user.model";
import { Session } from "inspector";
import { SessionDocument } from "../model/session.model";
import { sign } from "../utils/jwt.utils";

export async function createUserSessionHandler(req : Request, res: Response) {
   
    // validate email and password

    const user = await validatePassword(req.body) as UserDocument;

    if (!user){
        return res.status(401).send("Invalid username or password");
    }

    // create a session

    const session = await createSession(user._id.toString(),req.get("user-agent") || "") as SessionDocument;

    // create access token

    const accessToken = createAccessToken({
        user,
        session,
      });
    // create refresh token

    const refreshToken = sign(session, {
        expiresIn: config.get("refreshTokenTtl"), // 1 year
      });

    // send refresh and access token back
    
    return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}