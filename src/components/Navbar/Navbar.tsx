import {
  Burger,
  Container,
  Group,
  Header,
  Paper,
  Transition,
  createStyles,
  Title,
  Text,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import React, { useState } from "react";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
    boxShadow: theme.shadows.xs,
  },

  logo: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
}));

const Navbar = () => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Link href={`/`} passHref>
          <Text className={classes.logo} component="a">
            URL Shortener
          </Text>
        </Link>
        <Group spacing="md">
          <Button radius="sm" variant="outline" color="black">
            Register
          </Button>
          <Button radius="sm" color="black">
            Login
          </Button>
        </Group>
      </Container>
    </Header>
  );
};

export default Navbar;
