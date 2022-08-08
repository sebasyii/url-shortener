import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import React, { ReactElement, useState } from "react";

import {
  Container,
  Table,
  Checkbox,
  ActionIcon,
  Center,
  Group,
  Paper,
  Stack,
  Title,
  Text,
  Anchor,
  Tooltip,
} from "@mantine/core";

import { createStyles } from "@mantine/core";

import { IconTrash, IconEye, IconArrowLeft } from "@tabler/icons";

import { DateTime } from "luxon";

import NextLink from "next/link";

const useStyles = createStyles((theme) => ({
  table: {
    // borderRadius: theme.radius.md,
    // paddingTop: theme.spacing.md * 3,
    // paddingBottom: theme.spacing.md * 3,
    // boxShadow: theme.shadows.sm,
    // backgroundColor: theme.colors.gray[2],
    boxShadow: theme.shadows.md,

    borderCollapse: "separate",
    borderSpacing: 0,

    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,

    width: "100%",

    "& thead tr th": {
      padding: "1rem 1.25rem",
    },

    "& tbody tr td": {
      padding: "0.75rem 1rem",
    },
  },
  tableHead: {
    backgroundColor: theme.colors.gray[1],
  },
  tableLeftHead: {
    borderTopLeftRadius: theme.radius.md,
  },

  tableRightHead: {
    borderTopRightRadius: theme.radius.md,
  },

  tableInner: {
    tableLayout: "fixed",
    borderCollapse: "collapse",
    width: "100%",
    // backgroundColor: theme.colors.gray[3],
  },

  td: {
    padding: "25px",
    whiteSpace: "nowrap",
  },

  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

interface Click {
  createdAt: string;
  id: string;
  trackId: string;
  updatedAt: string;
  url: string;
  clicks: {
    createdAt: string;
    id: string;
    ip: string;
    trackId: string;
    updatedAt: string;
    userAgent: string;
  }[];
}

const Link = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formattedData, setFormattedData] = useState<Click>(JSON.parse(data));

  const { classes, cx } = useStyles();

  const [selection, setSelection] = useState<string[]>([]);

  console.log(formattedData);

  if (formattedData.clicks === undefined || formattedData.clicks.length === 0) {
    return (
      <>
        <div style={{ marginBottom: "24px" }}>
          <NextLink href={`/`} passHref>
            <Anchor component="a">
              <Group align="center" spacing={0}>
                <IconArrowLeft size={20} />
                Back To Links
              </Group>
            </Anchor>
          </NextLink>
        </div>
        <Paper radius="md" p="lg" shadow="md" mt="md">
          <Center py="lg">
            <Stack align="center" spacing="xs">
              <Title order={3}>This link has not been visited.</Title>
              <Text color="dark">Visit this link to collect data.</Text>
            </Stack>
          </Center>
        </Paper>
      </>
    );
  }

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === formattedData.clicks.length ||
      (current.length < formattedData.clicks.length && current.length !== 0)
        ? []
        : formattedData.clicks.map((item) => item.trackId)
    );

  const rows = formattedData.clicks.map((link) => {
    const selected = selection.includes(link.trackId);
    return (
      <tr
        key={link.trackId}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <td>
          <Checkbox
            checked={selection.includes(link.trackId)}
            onChange={() => toggleRow(link.trackId)}
            transitionDuration={200}
          />
        </td>
        <td className={classes.td}>
          <Text>{link.ip}</Text>
        </td>
        <td className={classes.td}>
          <Tooltip label={link.userAgent}>
            <Text style={{ width: "400px", overflowX: "hidden" }}>
              {link.userAgent}
            </Text>
          </Tooltip>
        </td>
        <td>
          {DateTime.fromISO(link.createdAt).toLocaleString(DateTime.DATE_FULL)}
        </td>
        <td>
          {DateTime.fromISO(link.updatedAt).toLocaleString(DateTime.DATE_FULL)}
        </td>
        <td>
          <Group>
            <ActionIcon>
              <IconTrash size={20} />
            </ActionIcon>

            <ActionIcon>
              <IconEye size={20} />
            </ActionIcon>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <section>
      <Container size="lg">
        <div style={{ marginBottom: "24px" }}>
          <NextLink href={`/`} passHref>
            <Anchor component="a">
              <Group align="center" spacing={0}>
                <IconArrowLeft size={20} />
                Back To Links
              </Group>
            </Anchor>
          </NextLink>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table className={classes.table}>
            <thead className={classes.tableHead}>
              <tr>
                <th className={cx(classes.tableLeftHead)}>
                  <Checkbox
                    // checked={selection.includes(item.id)}
                    checked={selection.length === formattedData.clicks.length}
                    indeterminate={
                      selection.length > 0 &&
                      selection.length !== formattedData.clicks.length
                    }
                    onChange={toggleAll}
                    transitionDuration={200}
                  />
                </th>
                <th>IP</th>
                <th>User Agent</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th className={cx(classes.tableRightHead)}>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </Container>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await prisma.track.findUnique({
    where: {
      trackId: context.params?.id as string,
    },
    include: {
      clicks: true,
    },
  });

  return {
    props: {
      data: JSON.stringify(data),
    },
  };
};

Link.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Link;
