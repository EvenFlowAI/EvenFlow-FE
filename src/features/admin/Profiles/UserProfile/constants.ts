import { TForm, TPasswordForm } from "./types";

export const blankProfile: TForm = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

export const initialPasswordForm: TPasswordForm = {
  oldPassword: "",
  newPassword: "",
  repeatPassword: "",
};
