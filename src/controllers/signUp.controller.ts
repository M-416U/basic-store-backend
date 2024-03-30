import express from "express";

export const signUpController = async (
  req: express.Request & { token: string },
  res: express.Response
) => {
  try {
    const { token } = req;
    return res
      .status(201)
      .json({ message: "User Created successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
