import { generateShades } from "../utils/helpers";

const primaryShades = generateShades("#D8126A", 5);

export default {
  white: "#FFFFFF",
  black: "#000000",
  primary500: primaryShades[0],
  primary400: primaryShades[1],
  primary300: primaryShades[2],
  primary200: primaryShades[3],
  primary100: primaryShades[4],
  lightBg: "#fbe7f0",
  darkBg: "#410520",
  success: "#4ADE80",
  info: "#246BFD",
  warning: "#FACC15",
  disabled: "#D8D8D8",
  error: "#F75555",
  disabledButton: primaryShades[4],
  greyScale900: "#212121",
  greyScale800: "#424242",
  greyScale700: "#616161",
  greyScale600: "#757575",
  greyScale500: "#9E9E9E",
  greyScale400: "#BDBDBD",
  greyScale300: "#E0E0E0",
  greyScale200: "#EEEEEE",
  greyScale100: "#F5F5F5",
  greyScale50: "#FAFAFA",
  dark1: "#181A20",
  dark2: "#1F222A",
  dark3: "#35383F",
};
