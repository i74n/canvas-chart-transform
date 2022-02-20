export const createOptions = (options: string[]): HTMLOptionElement[] =>
  options.map((name: string) => {
    const option = document.createElement("option");

    option.textContent = name;
    option.value = name;

    return option;
  });

export const createCanvas = ({
  width,
  height,
}: {
  width: number;
  height: number;
}): HTMLCanvasElement =>
  Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
