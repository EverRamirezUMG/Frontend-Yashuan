import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Acopio } from "../src/pages/Acopio";
import Swal from "sweetalert2";

// Mocking the dependencies
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

// jest.mock("../src/components", () => ({
//   Encabezado: () => <div>Encabezado</div>,
//   NavBar: () => <div>NavBar</div>,
// }));

// jest.mock("../components/mod/IniciarCompra", () => ({
//   IniciarCompra: ({ estado, cambiarEstado, titulo }) => (
//     <div>{estado ? "Modal Open" : "Modal Closed"}</div>
//   ),
// }));

// jest.mock("../components/BotonToggle2", () => ({
//   __esModule: true,
//   default: ({ isChecked, onToggle }) => (
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={(e) => onToggle(e.target.checked)}
//     />
//   ),
// }));

// jest.mock("../components/PDF/comprobante", () => ({
//   __esModule: true,
//   default: ({ data }) => <div>Comprobante</div>,
// }));

describe("Acopio Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("username", "test-user");
    localStorage.setItem("codigo", "test-codigo");
  });

  afterEach(() => {
    localStorage.clear();
  });

  // test("renders Acopio component", () => {
  //   render(<Acopio />);
  //   expect(screen.getByText("Encabezado")).toBeInTheDocument();
  //   expect(screen.getByText("NavBar")).toBeInTheDocument();
  // });

  // test("displays user information", () => {
  //   render(<Acopio />);
  //   expect(screen.getByText("Encargado:")).toBeInTheDocument();
  //   expect(screen.getByText("test-user")).toBeInTheDocument();
  // });

  test("handles input change for productor name", () => {
    render(<Acopio />);
    const input = screen.getByPlaceholderText("Nombre completo");
    fireEvent.change(input, { target: { value: "John" } });
    expect(input.value).toBe("John");
  });

  test("handles adding a row with valid weight and tara", () => {
    render(<Acopio />);
    const pesoInput = screen.getByPlaceholderText("Libras");
    const taraInput = screen.getByPlaceholderText("Bultos");
    const addButton = screen.getByText("Agregar");

    fireEvent.change(pesoInput, { target: { value: 100 } });
    fireEvent.change(taraInput, { target: { value: 10 } });
    fireEvent.click(addButton);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Peso bruto
    expect(screen.getByText("10")).toBeInTheDocument(); // Tara
    expect(screen.getByText("0.9")).toBeInTheDocument(); // Peso neto
  });

  test("handles error when adding a row with invalid weight", () => {
    render(<Acopio />);
    const pesoInput = screen.getByPlaceholderText("Libras");
    const addButton = screen.getByText("Agregar");

    fireEvent.change(pesoInput, { target: { value: 0 } });
    fireEvent.click(addButton);

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Error",
      text: "Debe ingresar un peso valido.",
    });
  });

  test("handles error when adding a row with negative tara", () => {
    render(<Acopio />);
    const pesoInput = screen.getByPlaceholderText("Libras");
    const taraInput = screen.getByPlaceholderText("Bultos");
    const addButton = screen.getByText("Agregar");

    fireEvent.change(pesoInput, { target: { value: 100 } });
    fireEvent.change(taraInput, { target: { value: -10 } });
    fireEvent.click(addButton);

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Error",
      text: "La tara no puede ser menor que 0.",
    });
  });

  test("handles finalizar compra confirmation", async () => {
    render(<Acopio />);
    const finalizarButton = screen.getByText("Finalizar compra");

    fireEvent.click(finalizarButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "¿Desea finalizar la compra?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });
    });
  });
});
