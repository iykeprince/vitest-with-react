import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import Label from "../../src/components/Label";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("Given the current language is EN", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])("should render $text for $labelId", ({ text, labelId }) => {
      renderComponent(labelId, "en");

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("Given the current language is ES", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render $text for $labelId", ({ text, labelId }) => {
      renderComponent(labelId, "es");

      screen.debug();
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("should throw an error if given an invalid labelid", () => {
    expect(() => renderComponent("!", "en")).toThrowError();
  });
});
