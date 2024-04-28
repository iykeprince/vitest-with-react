import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/routes";

describe("Router", () => {
  it("should render the homepage for the root route", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', {name: /home/i})).toBeInTheDocument()
  });
});
