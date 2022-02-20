import { createCanvas } from "./utils/html";

interface IChartProps {
  container: HTMLElement;

  width: number;
  height: number;
}

interface Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export class Chart {
  private grid: Layer;
  private chart: Layer;

  private width: number;
  private height: number;
  private container: HTMLElement;

  constructor({ container, width, height }: IChartProps) {
    this.width = width;
    this.height = height;
    this.container = container;

    this.container.style.position = "relative";

    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;

    this.grid = this.createLayer();
    this.chart = this.createLayer();

    this.container.append(this.grid.canvas, this.chart.canvas);
  }

  private createLayer(): Layer {
    const canvas = createCanvas({ width: this.width, height: this.height });

    canvas.classList.add("absolute", "top-0", "right-0", "bottom-0", "left-0");

    const ctx = canvas.getContext("2d")!;

    return { canvas, ctx };
  }
}
