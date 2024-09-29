export type typeContacto = {
    idContacto: number;
    // idEmisor: number;
    correoElectronico: string;
    // tipoContacto: number;
    // descTipoContacto: string;
    // nombre: string;
    // telefono: string;
  }

  export type typeEmisoresAutorizados = {
    idEmisor: number;
    nemonico: string;
    nombre: string;
    identificacion: string;
    razonSocial: string;
    pais: number;
    estado: number;
  }


  export type typeEmisor = {    
    idEmisor: number;
    estado: number;
    getNemonicoNombreEmisor: string;
    identificacionPrincipal: string;
    nemonico: string;
    nombre: string;
    razonSocial: string;
    establecimientos: typeEstablecimiento[];
  }

  export type typeEstablecimiento = {    
    idEstablecimiento: number;
    idEmisor: number;    
    codigoEstablecimiento: string;
    getEstableciminto: string;
    nombreEstablecimiento: string;    
    estado: number;
    puntos: typePunto[];
  }

  export type typePunto = {    
    idEmisor: number;
    idPunto: number;
    idEstablecimiento: number;
    codigoEstablecimiento: string;
    codigoPuntoEmisor: string;
    descripcion: string;
    getEstablecimientoPunto: string;
    getPunto: string;
    estado: number;
  }
