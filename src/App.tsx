import "@mantine/core/styles.css";
import { Box, Combobox, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import {
  AdvancedSearchInput,
  AdvancedSearchInputWrapper,
  FilterKeyComboboxOption,
  FilterKeyComboboxOptions,
  FilterValueComboboxOption,
  FilterValueComboboxOptions,
} from "./SearchInput";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Box w="300">
        <AdvancedSearchInputWrapper filters={["status", "type", "group"]}>
          <Combobox.Target>
            <AdvancedSearchInput />
          </Combobox.Target>

          <Combobox.Dropdown>
            <FilterKeyComboboxOptions>
              <FilterKeyComboboxOption value="status">Status</FilterKeyComboboxOption>
              <FilterKeyComboboxOption value="type">Type</FilterKeyComboboxOption>
              <FilterKeyComboboxOption value="group">Group</FilterKeyComboboxOption>
            </FilterKeyComboboxOptions>
            <FilterValueComboboxOptions belongsToKey="status">
              <FilterValueComboboxOption value="inactive">Inactive</FilterValueComboboxOption>
              <FilterValueComboboxOption value="active">Active</FilterValueComboboxOption>
              <FilterValueComboboxOption value="pending">Pending</FilterValueComboboxOption>
            </FilterValueComboboxOptions>
            <FilterValueComboboxOptions belongsToKey="type">
              <FilterValueComboboxOption value="admin">Admin</FilterValueComboboxOption>
              <FilterValueComboboxOption value="user">User</FilterValueComboboxOption>
            </FilterValueComboboxOptions>
            <FilterValueComboboxOptions belongsToKey="group">
              <FilterValueComboboxOption value="NL">NL</FilterValueComboboxOption>
              <FilterValueComboboxOption value="DE">DE</FilterValueComboboxOption>
              <FilterValueComboboxOption value="FR">FR</FilterValueComboboxOption>
            </FilterValueComboboxOptions>
          </Combobox.Dropdown>
        </AdvancedSearchInputWrapper>
      </Box>
    </MantineProvider>
  );
}
