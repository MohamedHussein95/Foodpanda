import chroma from "chroma-js";

export const generateShades = (color: string, steps: number) => {
  const shades = [];
  for (let i = 0; i < steps; i++) {
    const shade = chroma(color)
      .brighten(i * 0.1)
      .hex();
    shades.push(shade);
  }
  return shades;
};
