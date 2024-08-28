import { createTheme, MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = createTheme({
  primaryColor: "green",

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },

  fontFamily: "Bai Jamjuree, sans-serif",
  // fontFamily: "Prompt, sans-serif",
});
