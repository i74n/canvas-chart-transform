export const measureText = (
  ctx: CanvasRenderingContext2D,
  text: string
): {
  width: number;
  height: number;
} => {
  const {
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
  } = ctx.measureText(text);
  return {
    width: Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight),
    height: actualBoundingBoxAscent + actualBoundingBoxDescent,
  };
};
