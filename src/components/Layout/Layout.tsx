import { Container, createStyles } from "@mantine/core";
import React from "react";
import Navbar from "../Navbar";

const useStyles = createStyles((theme) => ({
  root: {
    margin: `${theme.spacing.xl * 5}px 0`,
  },
}));

const Layout = ({ children }) => {
  const { classes } = useStyles();
  return (
    <>
      <Navbar links={[{ link: "/hello", label: "Hello" }]} />
      <main className={classes.root}>
        <Container size="md">{children}</Container>
      </main>
    </>
  );
};

export default Layout;
