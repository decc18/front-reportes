/*  TIPOS DE OBJETOS REPORTE */
/*  Reporte */
export type typReporte = {
    idReporte: number;
    tipo: number;
    nombre: string;
    nombreSp: string;
    descripcion: string;
    codigoNegocio: string;
    acciones: string;
    accionFinal: number;
    permisos: string;
    esOnline: boolean;
    estadoReporte: number;
    estado: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    getTipo: string;
  }

/*  Hsitorial Reporte */
export type typHisotrial = {
    idHistorial: number;
    idReporte: number;
    idUsuarioGeneracion: number;
    nombreReporte: string;
    valores: string;
    tiempoGeneracion: string;
    estadoGeneracion: number;
    pathArchivo: string;
    estado: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    getEstadoGeneracion: string;
    tipo: string;
    tipoProceso: string;
    codigoNegocio: string;
};

/*  Accion Reporte */
export type typAccion = {
    idAccion: number;
    idReporte: number;
    idHistorial: number;
    idUsuarioGeneracion: number;
    nombreReporte: string;
    accion: number;
    accionDetalle: string;
    estado: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    getTipoAccion: string;
  }

export type typPermisos = {
    IdUsuario: number;
    Permisos: string;
    Bloqueado: number;
    Tipo: string;
  }

export type typCampo = {
  idCampo: number;
  idReporte: number;
  nombreCampo: string;
  parametroSp: string;
  descripcion: string;
  tipoValor: string;
  tipoComponente: string;
  catalogo: string;
  ordenCampo: number;
  visible: boolean;
  solicitarValor: boolean;
  requerido: boolean;
  placeholder: string;
  mensajeError: string;
  estado: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  valor: string | null;
  rules: [];
  catalogoPadre: string;
  itemsLista: typSelect[],
  isLoading: boolean
  }

  export type typSelect = {
    id: number;
    valor: string;
  }

  export type typEstablecimiento  = {
    codigoEstablecimiento: number; // Ajusta el tipo si es solo string o number
    getEstableciminto: string;
  }
  