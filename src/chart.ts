import { degToRad } from "./utils/degToRad";
import { createCanvas } from "./utils/html";
import { measureText } from "./utils/measureText";

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

  private padding: number = 20;

  private extremums: { [axis: string]: { min: number; max: number } } = {
    x: {
      min: -24.55,
      max: 50,
    },
    y: {
      min: -50,
      max: 50,
    },
  };

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

    this.renderGrid();
  }

  private createLayer(): Layer {
    const canvas = createCanvas({ width: this.width, height: this.height });

    canvas.classList.add("absolute", "top-0", "right-0", "bottom-0", "left-0");

    const ctx = canvas.getContext("2d")!;

    return { canvas, ctx };
  }

  private renderGrid() {
    this.grid.ctx.save();

    this.grid.ctx.lineWidth = 2;
    this.grid.ctx.strokeStyle = "#a2a3a4";
    this.grid.ctx.font = "16px consolas";
    this.grid.ctx.fillStyle = "#a2a3a4";

    const edges = {
      top: this.padding,
      right: this.width - this.padding,
      bottom: this.height - this.padding,
      left: this.padding,
    };

    const center = {
      x: (edges.left + edges.right) / 2,
      y: (edges.top + edges.bottom) / 2,
    };

    // horizontal line
    this.grid.ctx.moveTo(edges.left, center.y);
    this.grid.ctx.lineTo(edges.right, center.y);

    // vertical line
    this.grid.ctx.moveTo(center.x, edges.top);
    this.grid.ctx.lineTo(center.x, edges.bottom);

    this.grid.ctx.lineWidth = 1;

    const scale = {
      x:
        (edges.right - edges.left) /
        (this.extremums.x.max - this.extremums.x.min),
      y:
        (edges.bottom - edges.top) /
        (this.extremums.y.max - this.extremums.y.min),
    };

    console.log({
      extremums: this.extremums,
      edges,
      center,
      scale,
    });

    const dashSize = 10;
    const dashMargin = 10;

    const drawXDash = (x: number) => {
      const dashX = edges.left + (x - this.extremums.x.min) * scale.x;
      this.grid.ctx.moveTo(dashX, center.y - dashSize / 2);
      this.grid.ctx.lineTo(dashX, center.y + dashSize / 2);

      this.grid.ctx.save();
      const label = Math.round(x).toString();
      const { width } = measureText(this.grid.ctx, label);
      this.grid.ctx.translate(
        dashX - width / 2,
        center.y + dashSize + dashMargin
      );
      this.grid.ctx.rotate(degToRad(45));
      this.grid.ctx.fillText(label, 0, 0);
      this.grid.ctx.restore();
    };

    const drawYDash = (y: number) => {
      const dashY = edges.bottom - (y - this.extremums.y.min) * scale.y;
      this.grid.ctx.moveTo(center.x - dashSize / 2, dashY);
      this.grid.ctx.lineTo(center.x + dashSize / 2, dashY);

      this.grid.ctx.save();

      this.grid.ctx.textBaseline = "top";
      this.grid.ctx.textAlign = "left";

      const label = Math.round(y).toString();
      const { width } = measureText(this.grid.ctx, label);

      const angle = degToRad(45);

      this.grid.ctx.translate(
        center.x - dashSize / 2 - dashMargin - width * Math.cos(angle),
        dashY
      );
      this.grid.ctx.rotate(angle);
      this.grid.ctx.fillText(label, 0, -(width * Math.sin(angle)) / 2);
      this.grid.ctx.restore();
    };

    let start = (this.extremums.x.min + this.extremums.x.max) / 2;
    let stop = this.extremums.x.max;
    let step = (stop - start) / 10;

    for (let x = start; x <= stop; x += step) {
      drawXDash(x);
    }
    for (let x = start - step; x >= this.extremums.x.min; x -= step) {
      drawXDash(x);
    }

    start = (this.extremums.y.min + this.extremums.y.max) / 2;
    stop = this.extremums.y.max;
    step = (stop - start) / 10;

    for (let y = start; y <= stop; y += step) {
      drawYDash(y);
    }
    for (let y = start - step; y >= this.extremums.y.min; y -= step) {
      drawYDash(y);
    }

    this.grid.ctx.stroke();

    this.grid.ctx.restore();
  }
}
