import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

const trackData = Prisma.validator<Prisma.TrackSelect>()({
  trackId: true,
  url: true,
  createdAt: true,
  updatedAt: true,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const data = await prisma.track.findMany({
        select: trackData,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const data = await prisma.track.delete({
        where: {
          trackId: id as string,
        },
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "POST") {
    try {
      const data = await prisma.track.create({
        data: {
          url: req.body.link,
          trackId: nanoid(),
        },
        select: {
          trackId: true,
          url: true,
        },
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export default handler;
