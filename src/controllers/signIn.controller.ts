import express from "express";

export const signInController = (
  req: express.Request & { token: string },
  res: express.Response
) => {
  try {
    const { token } = req;
    res.status(200).json({ message: "login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
};
