import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { db, getProductsByCategoryId } from "../mocks/db";
import { CartProvider } from "../../src/providers/CartProvider";
import { simulateDelay } from "../mocks/utils";
import AllProviders from "../AllProviders";

describe("BrowseProductPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];
  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: `Category ${item}` });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(
          db.product.create({
            categoryId: category.id,
          })
        );
      });
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    const productIds = products.map((p) => p.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });
  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    const getProductSkeleton = () =>
      screen.queryByRole("progressbar", { name: /product/i });

    const getCategoryComboBox = () =>
      screen.queryByRole("combobox", { name: /category/i });
    const getCategorySkeleton = () => () =>
      screen.queryByRole("progressbar", { name: /categories/i });

    const selectCategory = async (name: RegExp | string) => {
      await waitForElementToBeRemoved(getCategorySkeleton);

      const combobox = getCategoryComboBox();
      const user = userEvent.setup();
      await user.click(combobox!);

      const option = screen.getByRole("option", { name });
      await user.click(option);
    };

    const expectProductsToBeInTheDocument = (products: Product[]) => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);
      expect(dataRows).toHaveLength(products.length);

      products.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    };

    return {
      getProductSkeleton,
      getCategoryComboBox,
      getCategorySkeleton,
      selectCategory,
      expectProductsToBeInTheDocument,
    };
  };
  // it("should show a loading skeleton when fetching categories", () => {
  //   simulateDelay("/categories");
  //   const { getCategorySkeleton } = renderComponent();

  //   expect(getCategorySkeleton()).toBeInTheDocument();
  // });

  it("should hide the loading skeleton after categories is fetched", async () => {
    renderComponent();

    waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should show the loading skeleton when fetching products", () => {
    simulateDelay("/products");

    const { getProductSkeleton } = renderComponent();

    expect(getProductSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products is fetched", async () => {
    const { getProductSkeleton } = renderComponent();

    waitForElementToBeRemoved(getProductSkeleton);
  });

  it("should not render an error if categories cannot be fetched", () => {
    server.use(http.get("/categories", () => HttpResponse.error()));

    const { getCategoryComboBox } = renderComponent();

    waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    expect(getCategoryComboBox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a list of categories in the combobox", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it.skip("should render all product if category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategoryId(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });
});
