import { ConfiguracionContacto } from "../models/index.js";

const ID_CONFIGURACION_CONTACTO = 1;

function convertirConfiguracionAdministracion(registro) {
  const datos = registro.get ? registro.get({ plain: true }) : registro;

  return {
    id: datos.id,
    telefono: datos.telefono ?? null,
    correo: datos.correo ?? null,
    mostrarTelefono: Boolean(datos.mostrarTelefono),
    mostrarCorreo: Boolean(datos.mostrarCorreo),
    createdAt: datos.createdAt,
    updatedAt: datos.updatedAt,
  };
}

function convertirConfiguracionPublica(registro) {
  if (!registro) {
    return {
      telefono: null,
      correo: null,
      mostrarTelefono: false,
      mostrarCorreo: false,
    };
  }

  const datos = registro.get ? registro.get({ plain: true }) : registro;
  const mostrarTelefono = Boolean(datos.mostrarTelefono && datos.telefono);
  const mostrarCorreo = Boolean(datos.mostrarCorreo && datos.correo);

  return {
    telefono: mostrarTelefono ? datos.telefono : null,
    correo: mostrarCorreo ? datos.correo : null,
    mostrarTelefono,
    mostrarCorreo,
  };
}

async function obtenerOCrearConfiguracionContacto() {
  const [configuracion] = await ConfiguracionContacto.findOrCreate({
    where: { id: ID_CONFIGURACION_CONTACTO },
    defaults: {
      id: ID_CONFIGURACION_CONTACTO,
      telefono: null,
      correo: null,
      mostrarTelefono: false,
      mostrarCorreo: false,
    },
  });

  return configuracion;
}

export async function obtenerConfiguracionContactoAdministracion() {
  const configuracion = await obtenerOCrearConfiguracionContacto();
  return convertirConfiguracionAdministracion(configuracion);
}

export async function actualizarConfiguracionContactoAdministracion(
  datos
) {
  const configuracion = await obtenerOCrearConfiguracionContacto();

  configuracion.telefono = datos.telefono ?? null;
  configuracion.correo = datos.correo ?? null;
  configuracion.mostrarTelefono = datos.mostrarTelefono;
  configuracion.mostrarCorreo = datos.mostrarCorreo;

  await configuracion.save();

  return convertirConfiguracionAdministracion(configuracion);
}

export async function obtenerConfiguracionContactoPublica() {
  const configuracion = await ConfiguracionContacto.findByPk(
    ID_CONFIGURACION_CONTACTO
  );

  return convertirConfiguracionPublica(configuracion);
}
