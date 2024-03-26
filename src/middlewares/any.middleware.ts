import express from "express";

export const validateDataForAnyRoute = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { anyData } = req.params;
  // validate data here
  if (!anyData) return res.send("no alowed").status(403);
  // if every things goes well run next function
  next();
};
