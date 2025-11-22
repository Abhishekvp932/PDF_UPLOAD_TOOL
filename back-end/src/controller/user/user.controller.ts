import { NextFunction, Request, Response } from "express";
import { IUserController } from "../../interface/user/IUserController";
import { HttpStatus } from "../../utils/HttpStatus";
import { IUserService } from "../../interface/user/IUserService";
import { AuthRequest } from "../../types/AuthRequest";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._userService.signup(email, password);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._userService.login(email, password);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async extractPdf(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const file = req.file;
      const pages = JSON.parse(req.body.pages || "[]");
      const userId = req.params.userId;
      if (!file) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ msg: "PDF file is required" });
        return;
      }
      const pdfBytes = await this._userService.extract(
        file.buffer,
        pages,
        userId
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=extracted.pdf"
      );

      res.status(HttpStatus.CREATED).send(Buffer.from(pdfBytes));
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  async getHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const result = await this._userService.getHistory(userId, page, limit);

      res
        .status(HttpStatus.OK)
        .json({
          data: result.pdfHistory,
          currentPage: page,
          totalPages: Math.ceil(result.total / limit),
          totalItem: result.total,
        });
    } catch (error) {
      next(error);
    }
  }
  async downloadPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('downloading request is comming',req.params);
      const {pdfId} = req.params;
      const result = await this._userService.downloadPdf(pdfId);
      res.download(result.filePath,result.fileName);
    } catch (error) {
      next(error);
    }
  }
}
