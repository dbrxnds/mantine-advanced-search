import { createContext, PropsWithChildren, Ref, RefObject, useContext, useRef, useState } from "react";
import { getWordByCaretPosition } from "./SearchInput";

interface AdvancedSearchInputContext {
  addFilterKey: (key: string) => void;
  addFilterValue: (value: string) => void;
  searchQueryString: string;
  setSearchQueryString: (queryString: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  getCaretPosition: () => number;
}

const AdvancedSearchInputContext = createContext<AdvancedSearchInputContext | null>(null);

export function AdvancedSearchInputProvider({ children }: PropsWithChildren) {
  const [searchQueryString, setSearchQueryString] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getCaretPosition = () => inputRef.current?.selectionStart ?? -1;

  const addFilterKey = (key: string) => {
    setSearchQueryString((prev) => {
      const caretPosition = getCaretPosition();
      const wordToRemove = getWordByCaretPosition({ value: prev, caretPosition });

      const parts = prev.split(" ");

      const wordIndex = parts.findIndex((part) => part === wordToRemove);

      if (wordIndex !== -1) {
        parts.splice(wordIndex, 1);
      }

      const newParts = [
        ...parts.slice(0, wordIndex >= 0 ? wordIndex : caretPosition),
        `${key}:`,
        ...parts.slice(wordIndex >= 0 ? wordIndex : caretPosition),
      ];

      return newParts.join(" ");
    });
  };

  const addFilterValue = (value: string) => {
    setSearchQueryString((prev) => {
      const parts = prev.split(" ");
      const caretPosition = getCaretPosition();

      const wordAtCaret = getWordByCaretPosition({ value: prev, caretPosition });

      if (wordAtCaret.includes(":")) {
        const [key] = wordAtCaret.split(":");

        // The space is so the user can continue typing after the value
        const newKeyValuePair = `${key}:${value} `;

        const wordIndex = parts.findIndex((part) => part === wordAtCaret);
        if (wordIndex !== -1) {
          parts[wordIndex] = newKeyValuePair;
        }

        return parts.join(" ");
      }

      return prev;
    });
  };

  return (
    <AdvancedSearchInputContext.Provider
      value={{
        addFilterKey,
        addFilterValue,
        searchQueryString,
        setSearchQueryString,
        inputRef,
        getCaretPosition,
      }}
    >
      {children}
    </AdvancedSearchInputContext.Provider>
  );
}

export function useAdvancedSearchInputContext() {
  const context = useContext(AdvancedSearchInputContext);
  if (!context) {
    throw new Error("useAdvancedSearchInput must be used within AdvancedSearchInputProvider");
  }
  return context;
}
