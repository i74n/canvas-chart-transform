import { degToRad } from "./utils/degToRad";

export const functions: { [key: string]: (x: number) => number } = {
  square: (x) => x ** 2,
  cube: (x) => x ** 3,
  sqrt: Math.sqrt,
  sin: (x) => Math.sin(degToRad(x)),
  cos: (x) => Math.cos(degToRad(x)),
};
