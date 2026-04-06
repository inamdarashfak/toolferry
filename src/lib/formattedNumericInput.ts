import type { ChangeEvent } from "react";

function getCaretIndexForDigitCount(formattedValue: string, digitCount: number) {
  if (digitCount <= 0) {
    return 0;
  }

  let digitsSeen = 0;

  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index])) {
      digitsSeen += 1;
    }

    if (digitsSeen === digitCount) {
      return index + 1;
    }
  }

  return formattedValue.length;
}

export function preserveFormattedNumberCaret({
  event,
  nextValue,
  setValue,
  locale,
  options,
}: {
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  nextValue: string;
  setValue: (value: string) => void;
  locale: string;
  options?: Intl.NumberFormatOptions;
}) {
  const input = event.target;
  const selectionStart = input.selectionStart ?? input.value.length;
  const digitsBeforeCaret = input.value
    .slice(0, selectionStart)
    .replace(/\D/g, "").length;

  setValue(nextValue);

  requestAnimationFrame(() => {
    if (document.activeElement !== input) {
      return;
    }

    const formattedValue =
      nextValue === ""
        ? ""
        : new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0,
            ...options,
          }).format(Number(nextValue));

    const nextCaretIndex = getCaretIndexForDigitCount(
      formattedValue,
      digitsBeforeCaret
    );

    input.setSelectionRange(nextCaretIndex, nextCaretIndex);
  });
}
