export type TErrorMessages = {
  path: string | number;
  message: string;
}[];
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: TErrorMessages;
};
