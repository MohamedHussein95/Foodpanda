import chroma from "chroma-js";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
export const capitalizeWords = (str: string) => {
  return str
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
};

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

export { wp, hp, DEVICE_HEIGHT, DEVICE_WIDTH };
