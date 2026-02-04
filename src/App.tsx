import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import type { CSSVariablesResolver } from "@mantine/core";

const theme = createTheme({
  white: "#FFFCF5",
});

const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    "--mantine-color-text": "#23120C",
  },
  dark: {
    "--mantine-color-text": "#23120C",
  },
});

export default function App() {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
      Hive
    </MantineProvider>
  );
}
