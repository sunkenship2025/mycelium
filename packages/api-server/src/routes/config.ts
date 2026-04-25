import { WorkspaceRequest } from "@myceliumhq/common-all";
import { ExpressUtils } from "@myceliumhq/common-server";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { getLogger } from "../core";
import { ConfigController } from "../modules/config";

const router = Router();
const L = getLogger();
const ctx = "config";

router.get(
  "/get",
  asyncHandler(async (req: Request, res: Response) => {
    L.info({ ctx, msg: "get:enter" });
    const resp = await ConfigController.instance().get(
      req.query as WorkspaceRequest
    );
    L.info({ ctx, msg: "get:ext", resp });
    ExpressUtils.setResponse(res, resp);
  })
);

export { router as configRouter };
