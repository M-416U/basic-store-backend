import express from "express";

export const anyController = (req: express.Request, res: express.Response) => {
  return res.send("Hello");
};
