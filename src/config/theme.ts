import { createTheme } from "@mui/material/styles";

const MyColor = {
  white: "#FFFFFF",
  black: "#000000",
  brandBlue: "#1976D2",
  lightBlue: "#42A5F5",
  darkBlue: "#1565C0",
  pr1: "#FDEFF4",
  pr2: "#F4D9D0",
  pr3: "#FFC0D3",
  pr4: "#FF5C8D",
  pr5: "#C75B7A",
  pr6: "#921A40",
  se1: "#F4F6F8",
  se2: "#37B7C3",
  se3: "#088395",
  se4: "#071952",
  se5: "#010A43",
  grey: "#A19E9A",
  red: "#F13535",
};

const theme = createTheme({
  palette: {
    primary: {
      main: MyColor.pr4,
      light: MyColor.pr3,
      dark: MyColor.pr5,
      contrastText: MyColor.white,
    },
    secondary: {
      main: MyColor.se3,
      light: MyColor.se2,
      dark: MyColor.se4,
      contrastText: MyColor.white,
    },
    background: {
      default: MyColor.se1,
      paper: MyColor.white,
    },
    text: {
      primary: MyColor.se5,
      secondary: MyColor.grey,
    },
    error: {
      main: MyColor.red,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
