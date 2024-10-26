import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Resumen from "../src/pages/Resumen";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../components", () => ({
  Encabezado: () => <div>Encabezado Mock</div>,
  NavBar: () => <div>NavBar Mock</div>,
}));

jest.mock("../components/NavBarMovil", () => ({
  NavBarMovil: () => <div>NavBarMovil Mock</div>,
}));

jest.mock("../components/chart/chart1", () => () => <div>ChartDias Mock</div>);

jest.mock("../components/chart/Pie-resumen-acopio", () => ({
  __esModule: true,
  default: ({ data }) => (
    <div>PieResumenAcopio Mock - Data: {JSON.stringify(data)}</div>
  ),
}));

describe("Resumen Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("acopio/total")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              semana: "Semana 1",
              compra: 10,
              consignado: 5,
              recolector: 15,
              total: 30,
            }),
        });
      }
      if (url.includes("acopio/resumen")) {
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, name: "Resumen 1" }]),
        });
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("renders Resumen component", async () => {
    render(
      <BrowserRouter>
        <Resumen />
      </BrowserRouter>
    );

    expect(screen.getByText("Encabezado Mock")).toBeInTheDocument();
    expect(screen.getByText("NavBar Mock")).toBeInTheDocument();
    expect(screen.getByText("NavBarMovil Mock")).toBeInTheDocument();
    expect(screen.getByText("Resumen acopio")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          'PieResumenAcopio Mock - Data: [{"id":1,"name":"Resumen 1"}]'
        )
      ).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  test("redirects to /Admin if no token", () => {
    localStorage.removeItem("token");
    render(
      <BrowserRouter>
        <Resumen />
      </BrowserRouter>
    );

    expect(screen.queryByText("Encabezado Mock")).not.toBeInTheDocument();
    expect(screen.queryByText("NavBar Mock")).not.toBeInTheDocument();
  });

  test("displays 'Sin fecha' when no date is provided", async () => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("acopio/total")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              compra: 10,
              consignado: 5,
              recolector: 15,
              total: 30,
            }),
        });
      }
      if (url.includes("acopio/resumen")) {
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, name: "Resumen 1" }]),
        });
      }
    });

    render(
      <BrowserRouter>
        <Resumen />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("sin fecha")).toBeInTheDocument();
    });
  });

  test("updates data every 5 seconds", async () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <Resumen />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
