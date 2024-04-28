import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  it("should render New as the default value", () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const button = screen.getByRole("combobox");
    expect(button).toHaveTextContent(/new/i);
  });
  it("should render correct statuses", async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const button = screen.getByRole("combobox");
    const user = userEvent.setup();
    await user.click(button);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
  it("should call onChange with processed when Processed option is selected", async () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    const button = screen.getByRole("combobox");
    const user = userEvent.setup();
    await user.click(button);

    const option = await screen.findByRole("option", {name: /processed/i});
    await user.click(option)


    expect(onChange).toHaveBeenCalledWith("processed");
  });
});
