import Layout from "@/components/Layout";
import LinksModal from "@/components/LinksModal";
import LinksTable from "@/components/LinksTable";
import { LinkData } from "@/types/typings";
import { Button, Group, Stack, Title } from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import React, { ReactElement, useState } from "react";

const Home = () => {
  const [opened, setOpened] = useState(false);

  const { data, isLoading, error } = useQuery<LinkData[], Error>(
    ["getLinks"],
    async () => {
      try {
        const { data } = await axios.get("/api/link");
        return data;
      } catch (error) {
        return error;
      }
    }
  );

  return (
    <>
      <Stack>
        <Group position="apart">
          <Title order={2}>Links</Title>
          <Button color="black" radius="md" onClick={() => setOpened(true)}>
            Create New Link
          </Button>
          <LinksModal opened={opened} setOpened={setOpened} />
        </Group>

        {/* <LinksTable data={data} isLoading={isLoading} error={error} /> */}
      </Stack>
    </>
  );
};

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Home;
