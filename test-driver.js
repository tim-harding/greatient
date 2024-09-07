import { Greatient } from "./greatients.js";

function main() {
  const canvas = document.getElementById("gradient");
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Not a canvas");
  const greatient = new Greatient(canvas);
}

main();
