import { easing } from "ts-easing";
import { Chart } from "./chart";
import { functions } from "./functions";
import "./style.css";
import { createOptions } from "./utils/html";

const easingSelect = document.querySelector<HTMLSelectElement>("#easing")!;
easingSelect.append(...createOptions(Object.keys(easing)));

const functionSelect = document.querySelector<HTMLSelectElement>("#functions")!;
functionSelect.append(...createOptions(Object.keys(functions)));

const chartElement = document.querySelector<HTMLCanvasElement>("#chart")!;

const chart = new Chart({
  container: chartElement,
  width: 800,
  height: 600,
});
