import { Combobox, ComboboxStore, TextInput, useCombobox } from "@mantine/core";
import { createContext, forwardRef, PropsWithChildren, useContext } from "react";
import { AdvancedSearchInputProvider, useAdvancedSearchInputContext } from "./Context";
import { useMergedRef } from "@mantine/hooks";

function defaultReduceObj<T extends string>(fields: T[]) {
  return fields.reduce((acc, field) => {
    acc[field] = [];
    return acc;
  }, {} as Record<T, string[]>);
}

export function parseSearchQuery<T extends string>(query: string, fields: T[]) {
  const parts = query.split(" ");

  const normalized = parts.reduce((acc, part) => {
    const [key, value] = part.split(":");
    if (fields.includes(key as T) && value) {
      const _key = key as T;
      acc[_key] = [...(acc[_key] || []), value];
    }
    return acc;
  }, defaultReduceObj(fields));

  return {
    normalized,
    remainingSearchQuery: parts
      .filter((part) => !part.includes(":"))
      .join(" ")
      .trim(),
  };
}

interface AdvancedSearchInputProps<Key extends string> {
  filters: Key[];
}

const FiltersContext = createContext<string[]>([]);
const ComboboxStoreContext = createContext<ComboboxStore | null>(null);

export function AdvancedSearchInputWrapper<Key extends string>({
  filters,
  children,
}: PropsWithChildren<AdvancedSearchInputProps<Key>>) {
  const combobox = useCombobox();

  return (
    <ComboboxStoreContext.Provider value={combobox}>
      <FiltersContext.Provider value={filters}>
        <Combobox store={combobox}>
          <AdvancedSearchInputProvider>{children}</AdvancedSearchInputProvider>
        </Combobox>
      </FiltersContext.Provider>
    </ComboboxStoreContext.Provider>
  );
}

export const AdvancedSearchInput = forwardRef<unknown, HTMLInputElement>((_, ref) => {
  const { inputRef, searchQueryString, setSearchQueryString } = useAdvancedSearchInputContext();
  const combobox = useContext(ComboboxStoreContext)!;

  const mergedRef = useMergedRef(inputRef, ref);

  return (
    <TextInput
      value={searchQueryString}
      onChange={(e) => setSearchQueryString(e.currentTarget.value)}
      onFocus={() => combobox.openDropdown()}
      onBlur={() => combobox.closeDropdown()}
      ref={mergedRef}
    />
  );
});

export function FilterKeyComboboxOptions({ children }: PropsWithChildren) {
  const filters = useContext(FiltersContext);
  const { searchQueryString, getCaretPosition } = useAdvancedSearchInputContext();

  const currentWord = getWordByCaretPosition({ value: searchQueryString, caretPosition: getCaretPosition() });
  const currentWordMatchesFilterKey = filters.find((filter) => `${filter}:` === currentWord) !== undefined;

  if (currentWordMatchesFilterKey) return null;

  return <Combobox.Options>{children}</Combobox.Options>;
}

export function FilterKeyComboboxOption({ value, children }: PropsWithChildren<{ value: string }>) {
  const { addFilterKey } = useAdvancedSearchInputContext();

  return (
    <Combobox.Option value={value} onClick={() => addFilterKey(value)}>
      {children}
    </Combobox.Option>
  );
}

export function FilterValueComboboxOptions({ children, belongsToKey }: PropsWithChildren<{ belongsToKey: string }>) {
  const { searchQueryString, getCaretPosition } = useAdvancedSearchInputContext();

  const currentWord = getWordByCaretPosition({ value: searchQueryString, caretPosition: getCaretPosition() });
  const currentWordMatchesFilterKey = `${belongsToKey}:` === currentWord;

  if (!currentWordMatchesFilterKey) return null;

  return <Combobox.Options>{children}</Combobox.Options>;
}

export function FilterValueComboboxOption({ value, children }: PropsWithChildren<{ value: string }>) {
  const { addFilterValue } = useAdvancedSearchInputContext();

  return (
    <Combobox.Option value={value} onClick={() => addFilterValue(value)}>
      {children}
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
