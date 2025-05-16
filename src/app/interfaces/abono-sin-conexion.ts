export interface AbonoSinConexion {
    codigo_credito: string | null;  // Permitir valores nulos
    valor: number;
    fecha_pago: Date;
    id_usuario: number | null; // Permitir valores nulos
    rec_menbrete: string | null;  // Permitir valores nulos
    latitud: number;  // Propiedad requerida
    longitud: number; // Propiedad requerida
}