export interface MensajeResponse<T> {
  codigo?: number;
  mensaje?: string;
  fecha?: Date;
  data?: T;
}