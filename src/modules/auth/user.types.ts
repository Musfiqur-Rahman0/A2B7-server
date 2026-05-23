export interface signUpUserPayloadSchema {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}
