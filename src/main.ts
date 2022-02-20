import { easing, IEasingMap } from "ts-easing";
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
  width: window.innerWidth * 0.8,
  height: window.innerHeight * 0.8,
});

chart.addEventListener("transitionstart", () => {
  functionSelect.disabled = true;
  easingSelect.disabled = true;
});

chart.addEventListener("transitionend", () => {
  functionSelect.disabled = false;
  easingSelect.disabled = false;
});

const updateFunction = () => {
  chart.fn = functions[functionSelect.value];
};
const updateEasing = () => {
  chart.easing = easing[easingSelect.value as keyof IEasingMap];
};

updateEasing();
updateFunction();

functionSelect.addEventListener("input", updateFunction);
easingSelect.addEventListener("input", updateEasing);
