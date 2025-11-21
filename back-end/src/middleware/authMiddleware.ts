import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { AuthRequest } from "../types/AuthRequest";

export const authMiddleware = (req:AuthRequest,res:Response,next:NextFunction)=>{
   try {
     const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if(!accessToken){
        return res.status(HttpStatus.UNAUTHORIZED).json({msg:'Access token missing'});
    }

    const decodeAccess = verifyAccessToken(accessToken);

    if(decodeAccess){
        req.user = decodeAccess;
        return next();
    }

    if(!refreshToken){
         return res.status(HttpStatus.UNAUTHORIZED).json({msg:'NO_REFRESH_TOKEN'});
    }

    const decodeRefresh = verifyRefreshToken(refreshToken);

    if(!decodeRefresh){
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ msg: "INVALID_REFRESH_TOKEN" });
    }

     const newAccessToken = generateAccessToken({
      id: decodeRefresh.id,
      email: decodeRefresh.email,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,     
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    req.user = decodeRefresh;

    next();
   } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "SERVER_ERROR_AUTH" });
   }

}