import React, { useState, useEffect, KeyboardEvent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Cita } from "./Cita";
import CitaItem from "./CitaItem";
import * as citaService from "./CitaService";
const CitaList = () => {
  const history = useHistory();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCitas = async () => {
    const res = await citaService.getCitas();
    console.log(res.data);
    const formatedVideos = res.data
      .map((cita) => {
        return {
          ...cita,
          createdAt: cita.createdAt ? new Date(cita.createdAt) : new Date(),
          updatedAt: cita.updatedAt ? new Date(cita.updatedAt) : new Date(),
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setCitas(formatedVideos);
    setLoading(false);
  };
  const onKeyUpValue = async (event: KeyboardEvent<HTMLInputElement>) => {
    const { value }: any = event.target;
    const res = await citaService.getCitas();
    const buscarCitas = res.data.filter(
      (cita: any) =>
        cita.estudiante.nombres.toLowerCase().indexOf(value) >= 0 ||
        cita.estudiante.nombres.toUpperCase().indexOf(value) >= 0 ||
        String(cita.estudiante.nro).toLowerCase().indexOf(value) >= 0 ||
        String(cita.estudiante.nro).toUpperCase().indexOf(value) >= 0
    );
    if (buscarCitas.length === 0) {
      console.log("Buscando alumnos...");
    } else {
      setCitas(buscarCitas);
    }
  };
  useEffect(() => {
    loadCitas();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Citas
              <a
                onClick={() => history.push("/citas/registro")}
                style={{ float: "right", color: "blue", cursor: "pointer" }}
              >
                {" "}
                Generar Cita
              </a>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-12">
                  <input
                    type="text"
                    autoFocus
                    onKeyUp={onKeyUpValue}
                    placeholder="Puede buscar alumno por nro de matricula o nombres"
                    className="form-control"
                  />
                </div>
              </div>
              <br />

              {loading ? (
                <>
                  <div className="row">
                    <div className="col-md-12 my-auto">
                      <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {citas.length === 0 ? (
                    <>
                      <>No hay citas publicadas.</>
                    </>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-primary">
                            <tr>
                              <th scope="col">COD</th>
                              <th scope="col">Alumno</th>
                              <th scope="col">Secretaria</th>
                              <th scope="col">Fecha citada</th>
                              <th scope="col">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="table-light">
                            {citas.map((cita) => (
                              <CitaItem cita={cita} key={cita._id} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitaList;