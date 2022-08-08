import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";

import type { GetServerSideProps } from "next";
import React, { ReactElement } from "react";

const UserLink = () => {
  return <div>UserLink</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const ip = req.socket.remoteAddress as string;
  const userAgent = req.headers["user-agent"] as string;

  const existingData = await prisma.track.findUnique({
    where: {
      trackId: context.params?.link as string,
    },
  });

  if (context.params?.link !== undefined && existingData) {
    const data = await prisma.track.update({
      where: {
        trackId: context.params?.link as string,
      },
      data: {
        clicks: {
          create: {
            ip,
            userAgent,
          },
        },
      },
      select: {
        url: true,
      },
    });

    return {
      redirect: {
        permanent: false,
        destination: data.url,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
};

UserLink.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default UserLink;
