import "@mantine/core/styles.css";
import { Box, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { AdvancedSearchInput } from "./SearchInput";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Box w="300">
        <AdvancedSearchInput
          filters={[
            { key: "status", options: ["active", "inactive", "pending"] },
            { key: "group", options: ["NL", "DE", "FR"] },
            { key: "type", options: ["user", "admin"] },
          ]}
        />
      </Box>
    </MantineProvider>
  );
}
