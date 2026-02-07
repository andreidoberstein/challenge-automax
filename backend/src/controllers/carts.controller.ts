import { Request, Response } from "express";
import { CartsService } from "../services/carts.service";
import { SyncService } from "../services/sync.service";

export class CartsController {
  constructor(
    private cartsService: CartsService,
    private syncService: SyncService
  ) {}

  list = async (req: Request, res: Response) => {
    const query = req.validated?.query as any; // tipado via DTO no route
    const carts = await this.cartsService.list(query);
    res.json(carts);
  };

  getById = async (req: Request, res: Response) => {
    const params = req.validated?.params as any;
    const cart = await this.cartsService.getById(params.id);
    res.json(cart);
  };

  sync = async (_req: Request, res: Response) => {
    const result = await this.syncService.syncCarts();
    res.json({ message: "Sync realizado com sucesso", ...result });
  };
}
