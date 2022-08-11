import { Request, Response } from 'express';
import { CoworkerService } from './coworker.service';

const service = new CoworkerService();

module.exports = {
  get: async (req: Request, res: Response, next: any) => {
    const filter: string = req?.query?.filter as string;
    try {
      const responsePayload = await service.getAll(filter);
      return res.status(200).send(responsePayload);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: any) => {
    try {
			const { id } = req.params;
			const coworker = await service.getOne(id);
			if (!coworker) {
				res.status(404).send(`Coworker with id: ${id} not found!`);
			} else {
				return res.status(200).send(coworker);
			}
		} catch (error) {
			next(error);
		}
  },

  updateById: async (req: Request, res: Response, next: any) => {
    try {
			const coworker = await service.update(req.body);
      if (!coworker) {
        res.status(404).send('Coworker not found!');
      } else {
        return res.status(200).send(coworker);
      }
		} catch (error) {
			next(error);
		}
  },
};
