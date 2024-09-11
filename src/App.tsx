import "@mantine/core/styles.css";
import { Box, Combobox, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { AdvancedSearchInput, AdvancedSearchInputProps } from "./SearchInput";

const FILTERS: AdvancedSearchInputProps<"status" | "locale" | "type">["filters"] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    key: "locale",
    label: "Locale",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { value: "public", label: "Public" },
      { value: "private", label: "Private" },
    ],
  },
];

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Box w="300">
        <AdvancedSearchInput filters={FILTERS} />
      </Box>
    </MantineProvider>
  );
}
