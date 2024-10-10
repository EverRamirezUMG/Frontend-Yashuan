// import React, { useState, useRef } from "react";
// import { useForm } from "react-hook-form";
// import styled from "styled-components";
// import "./styles/CrearUsuario.css";
// import swal from "sweetalert2";

// const CrearUser = ({ estado, cambiarEstado, titulo }) => {
//   const token = localStorage.getItem("token");
//   const URL = import.meta.env.VITE_URL;
//   const {
//     handleSubmit,
//     register,
//     reset,
//     formState: { errors },
//   } = useForm();
//   const fileInputRef = useRef(null);

//   const enviarUsuario = handleSubmit((data) => {
//     const formData = new FormData();
//     for (const key in data) {
//       formData.append(key, data[key]);
//     }
//     if (data.imagen && data.imagen.length > 0) {
//       formData.append("imagen", data.imagen[0]);
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
//     console.log(formData);
//     fetch(`${URL}usuarios`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//       signal: controller.signal,
//     })
//       .then((response) => {
//         clearTimeout(timeoutId);
//         if (response.ok) {
//           swal.fire({
//             title: "Usuario Agregado!",
//             icon: "success",
//             showConfirmButton: false,
//             timer: 1500,
//             customClass: {
//               confirmButton: "btEliminar",
//               cancelButton: "btCancelar",
//               popup: "popus-eliminado",
//               title: "titulo-pop",
//               container: "contenedor-alert",
//             },
//           });
//           cambiarEstado(false); // Close the modal
//           reset(); // Reset form values
//           setPreviewImage(null); // Clear the preview image
//           if (fileInputRef.current) {
//             fileInputRef.current.value = null; // Clear the file input
//           }
//         } else {
//           throw new Error("No se pudo agregar usuario");
//         }
//       })
//       .catch((error) => {
//         if (error.name === "AbortError") {
//           swal.fire({
//             title: "El servidor no responde",
//             text: "Intente más tarde",
//             icon: "error",
//             showConfirmButton: true,
//             customClass: {
//               confirmButton: "btEliminar",
//               cancelButton: "btCancelar",
//               popup: "popus-eliminado",
//               title: "titulo-pop",
//               container: "contenedor-alert",
//             },
//           });
//         } else {
//           swal.fire({
//             title: "No se pudo agregar usuario",
//             icon: "error",
//             showConfirmButton: true,
//             customClass: {
//               confirmButton: "btEliminar",
//               cancelButton: "btCancelar",
//               popup: "popus-eliminado",
//               title: "titulo-pop",
//               container: "contenedor-alert",
//             },
//           });
//         }
//         cambiarEstado(false); // Close the modal on error as well
//         reset(); // Reset form values on error
//         setPreviewImage(null); // Clear the preview image
//         if (fileInputRef.current) {
//           fileInputRef.current.value = null; // Clear the file input
//         }
//       });
//   });

//   const handleCloseModal1 = () => {
//     cambiarEstado(false);
//     reset(); // Reset form values
//     setPreviewImage(null); // Clear the preview image
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null; // Clear the file input
//     }
//   };

//   const handleCloseButtonClick = () => {
//     cambiarEstado(false);
//     reset(); // Reset form values
//     setPreviewImage(null); // Clear the preview image
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null; // Clear the file input
//     }
//   };

//   const [previewImage, setPreviewImage] = useState();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImage(null);
//     }
//   };

//   return (
//     <>
//       {estado && (
//         <Overlay>
//           <ContenedorModal>
//             <EncabezadoModal>
//               <h2>{titulo}</h2>
//             </EncabezadoModal>
//             <BotonCerrar onClick={handleCloseButtonClick}>
//               <span className="material-symbols-outlined">close</span>
//             </BotonCerrar>
//             <div className="Container-New-User">
//               <form
//                 className="New-User-Form"
//                 id="FormularioP"
//                 onSubmit={enviarUsuario}
//                 encType="multipart/form-data"
//               >
//                 <div className="Foto">
//                   <input
//                     {...register("imagen")}
//                     type="file"
//                     id="imagen"
//                     placeholder="Foto"
//                     ref={fileInputRef}
//                     onChange={(e) => {
//                       handleImageChange(e);
//                     }}
//                   ></input>
//                   {previewImage && (
//                     <img
//                       src={previewImage}
//                       alt="Preview"
//                       style={{
//                         width: "100px",
//                         height: "100px",
//                         marginTop: "10px",
//                       }}
//                     />
//                   )}
//                 </div>
//                 <div className="Cont-Item">
//                   <div className="Item-User">
//                     <label>Nombre: </label>
//                     <input
//                       {...register("nombre", {
//                         required: "El nombre es obligatorio",
//                       })}
//                       type="text"
//                       id="nombre"
//                       placeholder="Nombre"
//                     ></input>
//                     {errors.nombre && (
//                       <span className="error">{errors.nombre.message}</span>
//                     )}
//                   </div>
//                   <div className="Item-User">
//                     <label>Apellido: </label>
//                     <input
//                       {...register("apellido", {
//                         required: "El apellido es obligatorio",
//                       })}
//                       type="text"
//                       id="apellido"
//                       placeholder="Apellido"
//                     ></input>
//                     {errors.apellido && (
//                       <span className="error">{errors.apellido.message}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="Cont-Item">
//                   <div className="Item-User">
//                     <label>Alias: </label>
//                     <input
//                       {...register("alias")}
//                       type="text"
//                       id="alias"
//                       placeholder="Alias"
//                     ></input>
//                   </div>
//                   <div className="Item-User">
//                     <label>Correo: </label>
//                     <input
//                       {...register("email", {
//                         required: "* El correo es obligatorio",
//                         pattern: {
//                           value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                           message: "*El formato del correo no es válido",
//                         },
//                       })}
//                       type="text"
//                       id="email"
//                       placeholder="Correo electronico"
//                     ></input>
//                     {errors.email && (
//                       <span className="error">{errors.email.message}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="item">
//                   <label>Contraseña: </label>
//                   <input
//                     {...register("contrasenia", {
//                       required: "La contraseña es obligatoria",
//                       pattern: {
//                         value:
//                           /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                         message:
//                           "La contraseña debe tener al menos 8 caracteres, un número, una letra mayúscula y un símbolo",
//                       },
//                     })}
//                     type="password"
//                     id="contrasenia"
//                     placeholder="Contraseña"
//                   ></input>
//                   {errors.contrasenia && (
//                     <span className="error">{errors.contrasenia.message}</span>
//                   )}
//                 </div>
//                 <br />
//                 <div className="bonotesNewProv">
//                   <div>
//                     <button
//                       type="button"
//                       onClick={handleCloseModal1}
//                       className="btcancelar"
//                     >
//                       Cancelar
//                     </button>
//                   </div>
//                   <div>
//                     <button type="submit" className="btGuardar">
//                       Guardar
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </ContenedorModal>
//         </Overlay>
//       )}
//     </>
//   );
// };

// export default CrearUser;

// const Overlay = styled.div`
//   width: 100vw;
//   height: 100vh;
//   position: fixed;
//   top: 0;
//   left: 0;
//   background: rgba(0, 0, 0, 0.5);
//   padding: 40px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 9999995;
// `;

// const ContenedorModal = styled.div`
//   width: 650px;
//   min-height: 100px;
//   background: #f5f5f5;
//   position: relative;
//   border-radius: 5px;
//   box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
//   padding: 20px;
//   z-index: 99;
// `;

// const EncabezadoModal = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 20px;
//   padding-bottom: 20px;
//   border-bottom: 1px solid #b4b4b4;
//   color: #5e5e5e;
// `;

// const BotonCerrar = styled.button`
//   position: absolute;
//   top: 15px;
//   right: 20px;
//   justify-content: center;
//   align-items: center;
//   width: 30px;
//   height: 30px;
//   border: none;
//   background: none;
//   cursor: pointer;
//   transition: 0.3s ease all;
//   border-radius: 2px;
//   color: #e8e8e8;
//   padding: 2px 0px;

//   &:hover {
//     background: #ffca2c;
//     transition: 0.3s;
//   }

//   span {
//     width: 100%;
//     height: 100%;
//   }
// `;

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import "./styles/CrearUsuario.css";
import swal from "sweetalert2";

const CrearUser = ({ estado, cambiarEstado, titulo }) => {
  const token = localStorage.getItem("token");
  const URL = import.meta.env.VITE_URL;
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const fileInputRef = useRef(null);

  const enviarUsuario = handleSubmit((data) => {
    const formData = new FormData();

    // Agregar los datos del formulario
    formData.append("nombre", data.nombre);
    formData.append("apellido", data.apellido);
    formData.append("alias", data.alias);
    formData.append("email", data.email);
    formData.append("contrasenia", data.contrasenia);

    // Agregar el archivo de imagen al FormData
    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      formData.append("imagen", fileInputRef.current.files[0]);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    fetch(`${URL}usuarios`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeoutId);
        if (response.ok) {
          swal.fire({
            title: "Usuario Agregado!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              confirmButton: "btEliminar",
              cancelButton: "btCancelar",
              popup: "popus-eliminado",
              title: "titulo-pop",
              container: "contenedor-alert",
            },
          });
          cambiarEstado(false); // Close the modal
          reset(); // Reset form values
          setPreviewImage(null); // Clear the preview image
          if (fileInputRef.current) {
            fileInputRef.current.value = null; // Clear the file input
          }
        } else {
          throw new Error("No se pudo agregar usuario");
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          swal.fire({
            title: "El servidor no responde",
            text: "Intente más tarde",
            icon: "error",
            showConfirmButton: true,
            customClass: {
              confirmButton: "btEliminar",
              cancelButton: "btCancelar",
              popup: "popus-eliminado",
              title: "titulo-pop",
              container: "contenedor-alert",
            },
          });
        } else {
          swal.fire({
            title: "No se pudo agregar usuario",
            icon: "error",
            showConfirmButton: true,
            customClass: {
              confirmButton: "btEliminar",
              cancelButton: "btCancelar",
              popup: "popus-eliminado",
              title: "titulo-pop",
              container: "contenedor-alert",
            },
          });
        }
        cambiarEstado(false); // Close the modal on error
        reset(); // Reset form values on error
        setPreviewImage(null); // Clear the preview image
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // Clear the file input
        }
      });
  });

  const handleCloseModal1 = () => {
    cambiarEstado(false);
    reset(); // Reset form values
    setPreviewImage(null); // Clear the preview image
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
    }
  };

  const handleCloseButtonClick = () => {
    cambiarEstado(false);
    reset(); // Reset form values
    setPreviewImage(null); // Clear the preview image
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
    }
  };

  const [previewImage, setPreviewImage] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <h2>{titulo}</h2>
            </EncabezadoModal>
            <BotonCerrar onClick={handleCloseButtonClick}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <div className="Container-New-User">
              <form
                className="New-User-Form"
                id="FormularioP"
                onSubmit={enviarUsuario}
                encType="multipart/form-data"
              >
                <div className="Foto">
                  <input
                    type="file"
                    id="imagen"
                    placeholder="Foto"
                    ref={fileInputRef} // Solo mantener la referencia aquí
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
                <div className="Cont-Item">
                  <div className="Item-User">
                    <label>Nombre: </label>
                    <input
                      {...register("nombre", {
                        required: "El nombre es obligatorio",
                      })}
                      type="text"
                      id="nombre"
                      placeholder="Nombre"
                    />
                    {errors.nombre && (
                      <span className="error">{errors.nombre.message}</span>
                    )}
                  </div>
                  <div className="Item-User">
                    <label>Apellido: </label>
                    <input
                      {...register("apellido", {
                        required: "El apellido es obligatorio",
                      })}
                      type="text"
                      id="apellido"
                      placeholder="Apellido"
                    />
                    {errors.apellido && (
                      <span className="error">{errors.apellido.message}</span>
                    )}
                  </div>
                </div>
                <div className="Cont-Item">
                  <div className="Item-User">
                    <label>Alias: </label>
                    <input
                      {...register("alias")}
                      type="text"
                      id="alias"
                      placeholder="Alias"
                    />
                  </div>
                  <div className="Item-User">
                    <label>Correo: </label>
                    <input
                      {...register("email", {
                        required: "* El correo es obligatorio",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "*El formato del correo no es válido",
                        },
                      })}
                      type="text"
                      id="email"
                      placeholder="Correo electronico"
                    />
                    {errors.email && (
                      <span className="error">{errors.email.message}</span>
                    )}
                  </div>
                </div>
                <div className="item">
                  <label>Contraseña: </label>
                  <input
                    {...register("contrasenia", {
                      required: "La contraseña es obligatoria",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "La contraseña debe tener al menos 8 caracteres, un número, una letra mayúscula y un símbolo",
                      },
                    })}
                    type="password"
                    id="contrasenia"
                    placeholder="Contraseña"
                  />
                  {errors.contrasenia && (
                    <span className="error">{errors.contrasenia.message}</span>
                  )}
                </div>
                <br />
                <div className="bonotesNewProv">
                  <div>
                    <button
                      type="button"
                      onClick={handleCloseModal1}
                      className="btcancelar"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div>
                    <button type="submit" className="btGuardar">
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

export default CrearUser;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999995;
`;

const ContenedorModal = styled.div`
  width: 650px;
  min-height: 100px;
  background: #f5f5f5;
  position: relative;
  border-radius: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  z-index: 99;
`;

const EncabezadoModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #b4b4b4;
  color: #5e5e5e;
`;

const BotonCerrar = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.3s ease all;
  border-radius: 2px;
  color: #e8e8e8;
  padding: 2px 0px;

  &:hover {
    background: #ffca2c;
    transition: 0.3s;
  }

  span {
    width: 100%;
    height: 100%;
  }
`;
