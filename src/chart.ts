import { degToRad } from "./utils/degToRad";
import { createCanvas } from "./utils/html";
import { measureText } from "./utils/measureText";
import { animate } from "./utils/animate";

interface IChartProps {
  container: HTMLElement;

  width: number;
  height: number;
}

interface Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export class Chart extends EventTarget {
  private grid: Layer;
  private chart: Layer;

  private width: number;
  private height: number;
  private container: HTMLElement;

  private padding: number = 20;

  private extremums: { [axis: string]: { min: number; max: number } } = {
    x: {
      min: -20,
      max: 20,
    },
    y: {
      min: -100,
      max: 100,
    },
  };
  private edges: { top: number; right: number; bottom: number; left: number };
  private scale: { x: number; y: number };
  private center: { x: number; y: number };

  #fn?: (x: number) => number;

  public easing: (x: number) => number = (x) => x;

  constructor({ container, width, height }: IChartProps) {
    super();

    this.width = width;
    this.height = height;
    this.container = container;

    this.container.style.position = "relative";

    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;

    this.grid = this.createLayer();
    this.chart = this.createLayer();

    this.container.append(this.grid.canvas, this.chart.canvas);

    this.edges = this.calcEdges();
    this.scale = this.calcScale();
    this.center = this.calcCenter();

    this.renderGrid();
  }

  set fn(value: (x: number) => number) {
    if (typeof value !== "function") {
      throw new TypeError("fn should be a function");
    }

    this.dispatchEvent(new CustomEvent("transitionstart"));

    this.animatedFunctionTransition(this.#fn ?? (() => 0), value).then(() =>
      this.dispatchEvent(new CustomEvent("transitionend"))
    );

    this.#fn = value;

    this.drawFunction(this.#fn);
  }

  private createLayer(): Layer {
    const canvas = createCanvas({ width: this.width, height: this.height });

    canvas.classList.add("absolute", "top-0", "right-0", "bottom-0", "left-0");

    const ctx = canvas.getContext("2d")!;

    return { canvas, ctx };
  }

  private calcEdges() {
    return {
      top: this.padding,
      right: this.width - this.padding,
      bottom: this.height - this.padding,
      left: this.padding,
    };
  }

  private calcScale() {
    return {
      x:
        (this.edges.right - this.edges.left) /
        (this.extremums.x.max - this.extremums.x.min),
      y:
        (this.edges.bottom - this.edges.top) /
        (this.extremums.y.max - this.extremums.y.min),
    };
  }

  private calcCenter() {
    return {
      x: (this.edges.left + this.edges.right) / 2,
      y: (this.edges.top + this.edges.bottom) / 2,
    };
  }

  private renderGrid() {
    this.grid.ctx.save();

    this.grid.ctx.lineWidth = 2;
    this.grid.ctx.strokeStyle = "#a2a3a4";
    this.grid.ctx.font = "16px consolas";
    this.grid.ctx.fillStyle = "#a2a3a4";

    // horizontal line
    this.grid.ctx.moveTo(this.edges.left, this.center.y);
    this.grid.ctx.lineTo(this.edges.right, this.center.y);

    // vertical line
    this.grid.ctx.moveTo(this.center.x, this.edges.top);
    this.grid.ctx.lineTo(this.center.x, this.edges.bottom);

    this.grid.ctx.lineWidth = 1;

    const dashSize = 10;
    const dashMargin = 10;

    // draw horizontal dashes
    const drawHorizontalDashes = () => {
      const drawDash = (x: number) => {
        const dashX =
          this.edges.left + (x - this.extremums.x.min) * this.scale.x;
        this.grid.ctx.moveTo(dashX, this.center.y - dashSize / 2);
        this.grid.ctx.lineTo(dashX, this.center.y + dashSize / 2);

        this.grid.ctx.save();
        const label = x.toFixed(1);
        const { width } = measureText(this.grid.ctx, label);
        this.grid.ctx.translate(
          dashX - width / 2,
          this.center.y + dashSize + dashMargin
        );
        this.grid.ctx.rotate(degToRad(45));
        this.grid.ctx.fillText(label, 0, 0);
        this.grid.ctx.restore();
      };

      const start = (this.extremums.x.min + this.extremums.x.max) / 2;
      const stop = this.extremums.x.max;
      const step = (stop - start) / 10;

      for (let x = start; x <= stop; x += step) {
        drawDash(x);
      }

      for (let x = start - step; x >= this.extremums.x.min; x -= step) {
        drawDash(x);
      }
    };

    const drawVerticalDashes = () => {
      const drawDash = (y: number) => {
        const dashY =
          this.edges.bottom - (y - this.extremums.y.min) * this.scale.y;
        this.grid.ctx.moveTo(this.center.x - dashSize / 2, dashY);
        this.grid.ctx.lineTo(this.center.x + dashSize / 2, dashY);

        this.grid.ctx.save();

        this.grid.ctx.textBaseline = "top";
        this.grid.ctx.textAlign = "left";

        const label = y.toFixed(1);
        const { width } = measureText(this.grid.ctx, label);

        const angle = degToRad(45);

        this.grid.ctx.translate(
          this.center.x - dashSize / 2 - dashMargin - width * Math.cos(angle),
          dashY - (width * Math.sin(angle)) / 2
        );
        this.grid.ctx.rotate(angle);
        this.grid.ctx.fillText(label, 0, 0);
        this.grid.ctx.restore();
      };

      const start = (this.extremums.y.min + this.extremums.y.max) / 2;
      const stop = this.extremums.y.max;
      const step = (stop - start) / 10;

      for (let y = start; y <= stop; y += step) {
        drawDash(y);
      }

      for (let y = start - step; y >= this.extremums.y.min; y -= step) {
        drawDash(y);
      }
    };

    drawHorizontalDashes();
    drawVerticalDashes();

    this.grid.ctx.stroke();

    this.grid.ctx.restore();
  }

  private drawFunction(fn: (x: number) => number) {
    this.chart.ctx.clearRect(0, 0, this.width, this.height);

    this.chart.ctx.save();

    this.chart.ctx.lineWidth = 2;

    this.chart.ctx.beginPath();

    const calcPoint = (x: number) => {
      const y = fn(this.extremums.x.min + x / this.scale.x);
      return this.center.y - this.scale.y * y;
    };

    const step = 1;

    this.chart.ctx.moveTo(this.edges.left, calcPoint(this.edges.left));

    for (let x = this.edges.left + step; x <= this.edges.right; x += step) {
      this.chart.ctx.lineTo(this.padding + x, calcPoint(x));
    }

    this.chart.ctx.strokeStyle = "cornflowerblue";

    this.chart.ctx.stroke();

    this.chart.ctx.restore();
  }

  private async animatedFunctionTransition(
    from: (x: number) => number,
    to: (x: number) => number
  ) {
    const NaNToZero = (num: number) => (Number.isNaN(num) ? 0 : num);

    const onFrame = (animationProgress: number) => {
      this.drawFunction((x) => {
        const [fromY, toY] = [from(x), to(x)].map(NaNToZero);

        return fromY + animationProgress * (toY - fromY);
      });
    };

    await animate(1000, onFrame, this.easing);
  }
}
