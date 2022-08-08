import { render, screen } from "@testing-library/react";
import Home from "..";
import React from "react";

describe("Home", () => {
  it("renders without crashing", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: "A Next.js Typescript Mantine Starter Template",
    });

    const button = screen.getByRole("link", {
      name: "Visit Github Page",
    });

    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
