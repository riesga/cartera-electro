export interface Abono{
    id_usuario: number,
    codigo_credito: number,
    valor: number,
    forma_abono: string,
    tipo_tarjeta:  string,
    numero_autorizacion: number,
    id_banco: number,
    numero_cheque: number,
}