import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });
  it("should render a product detail", async () => {
    const product = db.product.findFirst({where: { id: { equals: productId }}})
    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render a message if product not found", async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null, {status: 404})) )
    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error for invalid product id", async () => {
    
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid productid/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error if data fetching fails", async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()) )
    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });
});
