import { Modal, Group, Button, TextInput, createStyles } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { Prisma } from "@prisma/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const isValidHTTPUrl = (url: string | URL) => {
  let properUrl: string | URL;
  try {
    properUrl = new URL(url);
  } catch (error) {
    return false;
  }

  return properUrl.protocol === "http:" || properUrl.protocol === "https:";
};

interface LinksModalProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  link: string;
}

const LinksModal = ({ opened, setOpened }: LinksModalProps) => {
  const form = useForm<FormValues>({
    initialValues: {
      link: "",
    },
  });

  const queryClient = useQueryClient();

  const addLink = useMutation<unknown, Error, FormValues>(
    (values) => axios.post(`/api/link`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getLinks"]);
      },
    }
  );

  const handleSubmit = async (values: FormValues) => {
    if (!isValidHTTPUrl(values.link)) {
      console.error("Invalid URL");
      form.setErrors({ link: "Invalid URL" });
      return;
    }
    form.reset();
    setOpened(false);

    addLink.mutate(values);
  };

  return (
    <>
      <Modal
        centered
        size="lg"
        radius="md"
        shadow="lg"
        padding="xl"
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="Please enter a link"
        overlayOpacity={0.8}
        overlayBlur={5}
      >
        {/* Modal content */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Link"
            placeholder="https://sebastianyii.com"
            {...form.getInputProps("link")}
          />
          <Button mt="md" radius="md" type="submit" color="black">
            Add Link
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default LinksModal;
