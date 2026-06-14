import { Request, Response, NextFunction } from 'express';
import { componentService } from './component.service';
import type { ComponentQueryInput } from './component.validator';

function isAdminRequest(req: Request): boolean {
  return req.user?.role === 'ADMIN' || req.user?.role === 'SUPERADMIN';
}

export class ComponentController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await componentService.getAll(req.query as unknown as ComponentQueryInput);

      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const component = await componentService.getById(req.params.id, {
        isAdmin: isAdminRequest(req),
      });

      res.status(200).json({
        success: true,
        data: component,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const component = await componentService.create(req.body);

      res.status(201).json({
        success: true,
        data: component,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const component = await componentService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        data: component,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await componentService.delete(req.params.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const componentController = new ComponentController();
