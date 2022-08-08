import { LinkData } from "@/types/typings";
import {
  ActionIcon,
  Center,
  Checkbox,
  Paper,
  Skeleton,
  Stack,
  Table,
  Title,
  Text,
  Group,
  CopyButton,
  Tooltip,
} from "@mantine/core";

import { IconCheck, IconCopy, IconEye, IconTrash } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { DateTime } from "luxon";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useStyles from "./LinksTable.styles";

interface LinksTableProps {
  data: LinkData[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const LinksTable = ({ data, isLoading, error }: LinksTableProps) => {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selection, setSelection] = useState<string[]>([]);

  const deleteLink = useMutation(
    (id: string) => axios.delete(`/api/link?id=${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getLinks"]);
      },
    }
  );

  if (data === undefined || data.length === 0) {
    return (
      <>
        <Paper radius="md" p="lg" shadow="md">
          <Center py="lg">
            <Stack align="center" spacing="xs">
              <Title order={3}>No links found</Title>
              <Text color="dark">
                Click on Create New Link Button to get started.
              </Text>
            </Stack>
          </Center>
        </Paper>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Paper radius="md" p="lg" shadow="md">
          <Center py="lg">
            <Stack align="center" spacing="xs">
              <Title order={3}>An Error Occurred.</Title>
              <Text color="red">Please refresh the page and try again.</Text>
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
      current.length === data.length ||
      (current.length < data.length && current.length !== 0)
        ? []
        : data.map((item) => item.trackId)
    );

  const rows = data.map((link) => {
    const selected = selection.includes(link.trackId);
    return (
      <tr
        key={link.trackId}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <td>
          <Skeleton visible={isLoading}>
            <Checkbox
              checked={selection.includes(link.trackId)}
              onChange={() => toggleRow(link.trackId)}
              transitionDuration={200}
            />
          </Skeleton>
        </td>
        <td className={classes.td}>
          <Skeleton visible={isLoading}>{link.url}</Skeleton>
        </td>
        <td>
          <Skeleton visible={isLoading}>
            {DateTime.fromISO(link.createdAt).toLocaleString(
              DateTime.DATE_FULL
            )}
          </Skeleton>
        </td>
        <td>
          <Skeleton visible={isLoading}>
            {DateTime.fromISO(link.updatedAt).toLocaleString(
              DateTime.DATE_FULL
            )}
          </Skeleton>
        </td>
        <td>
          <Skeleton visible={isLoading}>
            <Group>
              <ActionIcon onClick={() => deleteLink.mutate(link.trackId)}>
                <IconTrash size={20} />
              </ActionIcon>

              <ActionIcon onClick={() => router.push(`/link/${link.trackId}`)}>
                <IconEye size={20} />
              </ActionIcon>

              <CopyButton
                value={`${window.location.hostname}:3000/${link.trackId}`}
                timeout={2000}
              >
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy"}>
                    <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                      {copied ? (
                        <IconCheck size={20} />
                      ) : (
                        <IconCopy size={20} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Skeleton>
        </td>
      </tr>
    );
  });

  return (
    <Table className={classes.table}>
      <thead className={classes.tableHead}>
        <tr>
          <th className={cx(classes.tableLeftHead)}>
            <Checkbox
              // checked={selection.includes(item.id)}
              checked={selection.length === data.length}
              indeterminate={
                selection.length > 0 && selection.length !== data.length
              }
              onChange={toggleAll}
              transitionDuration={200}
            />
          </th>
          <th>Links</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th className={cx(classes.tableRightHead)}>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default LinksTable;
