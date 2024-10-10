import React from "react";

import "../styles/HomeWEB.css";
import "../styles/HomeWEBtablet.css";

import Portada from "../../public/IMG/01-portada.jpg";
import caf1 from "../../public/IMG/02-reel.jpg";
import caf2 from "../../public/IMG/03-reel.jpg";
import caf3 from "../../public/IMG/04-reel.jpg";

import proceso1 from "../../public/IMG/proceso-01.jpg";
import proceso2 from "../../public/IMG/proceso-02.png";
import proceso3 from "../../public/IMG/proceso-03.png";

import beneficio1 from "../../public/IMG/beneficio-01.jpg";
import beneficio2 from "../../public/IMG/beneficio-02.jpg";
import beneficio3 from "../../public/IMG/beneficio-03.jpg";
import beneficio4 from "../../public/IMG/beneficio-04.jpg";
import { NavBarWEB } from "../components/NavBarWEB";
import { Footer } from "../components/footer";

export const HomeWeb = () => {
  return (
    <>
      <NavBarWEB titulo="Café de la region Atitlán" />
      <div className="ContenedorWEB">
        <div className="Contenido">
          <div className="Portada">
            <div className="portadaIMG">
              <img src={Portada} />
              <h1>Café de la region Atitlán</h1>
            </div>
            <div className="descripcion">
              <span>
                <p>
                  El café de la región Atitlán es considerado el más dulce del
                  país debido a que es cultivado entre las laderas de los
                  volcanes y el lago Atitlán con corrientes de viento que
                  generan microclimas que influyen en el desarrollo del café,
                  obteniendo un característico aroma, con pronunciada acidez
                  cítrica y mucho cuerpo.
                </p>
                <br />
                <p>
                  El suelo de Atitlán es el más rico en términos de materia
                  orgánica. En este sitio se puede encontrar un delicioso grano
                  Bourbon, Typica, Caturra y Catuaí.
                </p>
              </span>
            </div>
            <div className="Reel">
              <div className="IMGcont">
                <img src={caf1} />
              </div>
              <div className="IMGcont">
                <img src={caf2} />
              </div>
              <div className="IMGcont">
                <img src={caf3} />
              </div>
            </div>
            <div className="Procesos">
              <h2>Procesos del café</h2>
              <div className="proceso">
                <div className="descripcionP">
                  <div className="titulo">
                    <h2>Proceso Lavado</h2>
                  </div>
                  <span>
                    <p>
                      Es un proceso que se centra únicamente en el grano, en la
                      cual se le quita la pulpa y la miel o mucilago, dejando
                      los granos limpios permitiendo así saborear la esencia
                      interna de la misma
                    </p>
                  </span>
                </div>
                <div className="imagen">
                  <img src={proceso1} alt="Proceso lavado" />
                </div>
              </div>

              <div className="proceso">
                <div className="descripcion">
                  <div className="titulo">
                    <h2>Proceso Honey</h2>
                  </div>
                  <span>
                    <p>
                      Es el puente entre un café húmedo y un natural. La cereza
                      se despulpa y luego se seca aún con la capa del mucílago
                      que queda en el pergamino.
                    </p>
                  </span>
                </div>
                <div className="imagen">
                  <img src={proceso2} alt="Proceso Honey" />
                </div>
              </div>

              <div className="proceso">
                <div className="descripcion">
                  <div className="titulo">
                    <h2>Proceso Natural</h2>
                  </div>
                  <span>
                    <p>
                      Es un café no adulterado, la fabricación de este tipo de
                      café es relativamente sencilla. Para abreviarlo, se cogen
                      los granos de café y se tuestan.
                    </p>
                  </span>
                </div>
                <div className="imagen">
                  <img src={proceso3} alt="Proceso Natural" />
                </div>
              </div>
            </div>

            <div className="Beneficio">
              <h2>Beneficio humedo de café</h2>
              <div className="Reel">
                <div className="IMGcont">
                  <img src={beneficio1} />
                </div>
                <div className="IMGcont">
                  <img src={beneficio2} />
                </div>
                <div className="IMGcont">
                  <img src={beneficio3} />
                </div>
                <div className="IMGcont">
                  <img src={beneficio4} />
                </div>
              </div>

              <div className="descripcion">
                <span>
                  <p>
                    Un beneficio de café es una instalación en donde se procesa
                    el café después de ser cosechado, en ello se realizan una
                    serie de actividades para transformar los cerezos de café en
                    café pergamino para ser comercializados o exportados, dicho
                    proceso consiste en el despulpado, lavado y secado del café,
                    esto con el fin de producir café pergamino de alta calidad
                    para cumplir con las exigencias del mercado.  El término
                    "beneficio" en el contexto del café se refiere al proceso de
                    transformación del fruto del café, desde la cosecha hasta la
                    etapa en que las semillas de café están listas para ser
                    comercializadas.  
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default HomeWeb;
