import { Combobox, ComboboxStore, TextInput, useCombobox } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { createContext, PropsWithChildren, ReactNode } from "react";
import { AdvancedSearchInputProvider, useAdvancedSearchInputContext } from "./Context";

function defaultReduceObj<T extends string>(fields: T[]) {
  return fields.reduce((acc, field) => {
    acc[field] = [];
    return acc;
  }, {} as Record<T, string[]>);
}

function parseSearchQuery<T extends string>(query: string, fields: T[]) {
  const parts = query.split(" ");

  const normalized = parts.reduce((acc, part) => {
    const [key, value] = part.split(":");
    if (fields.includes(key as T)) {
      const _key = key as T;
      acc[_key] = [...(acc[_key] || []), value];
    }
    return acc;
  }, defaultReduceObj(fields));

  return {
    normalized,
    remainingSearchQuery: parts.filter((part) => !part.includes(":")).join(" "),
  };
}

console.log(parseSearchQuery("name:John age:30 age:28 test", ["name", "age", "url"]));

interface Filter<Key extends string> {
  key: Key;
  options: string[];
}

interface AdvancedSearchInputProps<Key extends string> {
  filters: Filter<Key>[];
}

export function AdvancedSearchInput<Key extends string>(props: AdvancedSearchInputProps<Key>) {
  return (
    <AdvancedSearchInputProvider>
      <_AdvancedSearchInput {...props} />
    </AdvancedSearchInputProvider>
  );
}

export function _AdvancedSearchInput<Key extends string>({ filters }: AdvancedSearchInputProps<Key>) {
  const { inputRef, searchQueryString, setSearchQueryString } = useAdvancedSearchInputContext();

  const combobox = useCombobox();

  return (
    <FilterDropdown store={combobox} filters={filters}>
      <TextInput
        value={searchQueryString}
        onChange={(e) => setSearchQueryString(e.currentTarget.value)}
        onFocus={() => combobox.openDropdown()}
        onBlur={() => combobox.closeDropdown()}
        ref={inputRef}
      />
    </FilterDropdown>
  );
}

function FilterDropdown<Key extends string>({
  children,
  store,
  filters,
}: PropsWithChildren<
  Pick<AdvancedSearchInputProps<Key>, "filters"> & {
    store: ComboboxStore;
  }
>) {
  const { searchQueryString, getCaretPosition } = useAdvancedSearchInputContext();

  const filterOptionsByKey = filters.reduce((acc, filter) => {
    acc[filter.key] = filter.options.map((option) => <FilterValueComboboxOption value={option} />);

    return acc;
  }, {} as Record<Key, ReactNode>);

  const currentWord = getWordByCaretPosition({ value: searchQueryString, caretPosition: getCaretPosition() });
  const currentWordMatchesFilterKey = filters.find((filter) => `${filter.key}:` === currentWord) !== undefined;
  const currentWordWithoutColon = currentWord.split(":")[0];

  const dropDownContent = currentWordMatchesFilterKey
    ? filterOptionsByKey[currentWordWithoutColon as Key]
    : filters.map((filter) => <FilterKeyComboboxOption filter={filter} key={filter.key} />);

  return (
    <Combobox store={store}>
      <Combobox.Target>{children}</Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{dropDownContent}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function FilterKeyComboboxOption<Key extends string>({ filter }: { filter: Filter<Key> }) {
  const { addFilterKey } = useAdvancedSearchInputContext();

  return (
    <Combobox.Option value={filter.key} onClick={() => addFilterKey(filter.key)}>
      {filter.key}
    </Combobox.Option>
  );
}

function FilterValueComboboxOption({ value }: { value: string }) {
  const { addFilterValue } = useAdvancedSearchInputContext();

  return (
    <Combobox.Option value={value} onClick={() => addFilterValue(value)}>
      {value}
    </Combobox.Option>
  );
}

export function getWordByCaretPosition({ value, caretPosition }: { value: string; caretPosition: number }) {
  let start = caretPosition;
  let end = caretPosition;

  while (start > 0 && value[start - 1] !== " ") start--;
  while (end < value.length && value[end] !== " ") end++;

  const word = value.substring(start, end);
  return word;
}
