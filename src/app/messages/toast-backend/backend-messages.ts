export interface BackendMessagesInterface {
  200: string;
  400: string;
  500: string;
  [key: number]: string;
}

export const BackendMessages: BackendMessagesInterface = {
  200: 'Producto agregado exitosamente',
  400: 'Solicitud incorrecta. Verifique la información proporcionada.',
  500: 'Error interno del servidor. Inténtelo de nuevo más tarde.'
};

export const SpecificErrorMessages: { [key: string]: string } = {
  'Duplicate identifier found in the database': 'Identificador duplicado encontrado en la base de datos.',
  'id should not be empty': 'El ID no debe estar vacío',
  'name should not be empty': 'El nombre no debe estar vacío',
};