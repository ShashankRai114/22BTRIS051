import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import ShortenerPage from "./ShortenerPage";

test("ShortenerPage renders heading and controls", () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ShortenerPage navigateToStats={() => {}} />
      </ThemeProvider>
    </BrowserRouter>
  );

  expect(screen.getByText(/URL Shortener/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Row/i)).toBeInTheDocument();
});
