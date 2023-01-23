import { db } from "../database/database.js";
import { Request, Response } from "express";
import { rentalSchema } from "../schemas/rentalSchema.js";
import {
  deleteRentalRepo,
  getRentalByIdRepo,
  getRentalsRepo,
  paidRentalRepo,
  postRentalRepo,
} from "../repositories/rentalRepositories.js";

export type Rental = {
  id?: number;
  startDate: string | Date;
  endDate: string | Date;
  dailyPrice: number;
  totalPrice: number;
  isPaid: boolean;
  downPayment: number;
};

export async function getRentals(req: Request, res: Response) {
  try {
    const rentals = await getRentalsRepo()
    if (!rentals)
      return res.status(404).send("No rentals found");
    return res.send(rentals).status(200);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function postRental(req: Request, res: Response) {
  const rental: Rental = req.body;
  rental.totalPrice = res.locals.totalPrice;
  console.log(rental)
  const { error } = rentalSchema.validate(rental, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    await postRentalRepo(rental);
    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function deleteRental(req: Request, res: Response) {
  const { rentalId } = req.params;

  try {
    await deleteRentalRepo(Number(rentalId));
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function paidRental(req: Request, res: Response) {
  const { rentalId } = req.params;

  try {
    await paidRentalRepo(Number(rentalId));
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
}

export async function getRentalById(req: Request, res: Response) {
  const { rentalId } = req.params;
  try {
    const rental = await getRentalByIdRepo(Number(rentalId))
    if (!rental)
      return res.status(404).send("No rental found");
    return res.send(rental).status(200);
  } catch (error) {
    return res.status(400).send(error);
  }
}