import type { Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";

export type CurrencyOption = {
  code: string;
  locale: string;
  symbol: string;
  icon: string;
};

export const currencyOptions: CurrencyOption[] = [
  { code: "INR", locale: "en-IN", symbol: "₹", icon: "🇮🇳" },
  { code: "USD", locale: "en-US", symbol: "$", icon: "🇺🇸" },
  { code: "EUR", locale: "de-DE", symbol: "€", icon: "🇪🇺" },
  { code: "GBP", locale: "en-GB", symbol: "£", icon: "🇬🇧" },
  { code: "AED", locale: "en-AE", symbol: "د.إ", icon: "🇦🇪" },
  { code: "AUD", locale: "en-AU", symbol: "A$", icon: "🇦🇺" },
  { code: "CAD", locale: "en-CA", symbol: "C$", icon: "🇨🇦" },
  { code: "CHF", locale: "de-CH", symbol: "CHF", icon: "🇨🇭" },
  { code: "CNY", locale: "zh-CN", symbol: "¥", icon: "🇨🇳" },
  { code: "HKD", locale: "zh-HK", symbol: "HK$", icon: "🇭🇰" },
  { code: "JPY", locale: "ja-JP", symbol: "¥", icon: "🇯🇵" },
  { code: "NZD", locale: "en-NZ", symbol: "NZ$", icon: "🇳🇿" },
  { code: "SAR", locale: "ar-SA", symbol: "ر.س", icon: "🇸🇦" },
  { code: "SGD", locale: "en-SG", symbol: "S$", icon: "🇸🇬" },
  { code: "ZAR", locale: "en-ZA", symbol: "R", icon: "🇿🇦" },
];

export function detectDefaultCurrency() {
  if (typeof navigator === "undefined") {
    return currencyOptions[0];
  }

  const locale = navigator.language || "en-IN";
  const region = locale.split("-")[1]?.toUpperCase();

  const regionalCurrencyMap: Record<string, string> = {
    AE: "AED",
    AU: "AUD",
    CA: "CAD",
    CH: "CHF",
    CN: "CNY",
    DE: "EUR",
    ES: "EUR",
    FR: "EUR",
    GB: "GBP",
    HK: "HKD",
    IN: "INR",
    JP: "JPY",
    NZ: "NZD",
    SA: "SAR",
    SG: "SGD",
    US: "USD",
    ZA: "ZAR",
  };

  const matchedCode = regionalCurrencyMap[region ?? ""] ?? "INR";

  return (
    currencyOptions.find((option) => option.code === matchedCode) ??
    currencyOptions[0]
  );
}

export function sanitizeNumericInput(value: string, allowDecimal = false) {
  const sanitized = value.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");

  if (!allowDecimal) {
    return sanitized;
  }

  const [integerPart, ...decimalParts] = sanitized.split(".");

  if (decimalParts.length === 0) {
    return sanitized;
  }

  return `${integerPart}.${decimalParts.join("")}`;
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatAxisCurrencyValue(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }

  return formatNumber(value, "en-US", { maximumFractionDigits: 0 });
}

export function formatTooltipCurrencyValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
  locale: string,
  symbol: string
) {
  const normalizedValue = Array.isArray(value)
    ? Number(value[0])
    : Number(value);

  return `${symbol} ${formatNumber(
    Number.isFinite(normalizedValue) ? normalizedValue : 0,
    locale
  )}`;
}

export function useAnimatedNumber(target: number) {
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    let animationFrame = 0;
    const startValue = displayValue;
    const startTime = performance.now();
    const duration = 320;

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (target - startValue) * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [displayValue, target]);

  return displayValue;
}

export function getCalculatorPaperSx(theme: Theme) {
  return {
    p: { xs: 2.5, md: 2.5 },
    borderRadius: 0,
    border: `1px solid ${theme.palette.divider}`,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg, rgba(18,29,44,0.98) 0%, rgba(12,20,32,0.96) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.96) 100%)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 48px rgba(0, 0, 0, 0.26)"
        : "0 20px 50px rgba(11, 31, 51, 0.07)",
  };
}

export function getCalculatorPanelSx(theme: Theme) {
  return {
    p: { xs: 2.25, md: 2 },
    borderRadius: 0,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(11, 19, 32, 0.42)"
        : "rgba(255, 255, 255, 0.9)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 14px 30px rgba(0, 0, 0, 0.22)"
        : "0 14px 30px rgba(11, 31, 51, 0.045)",
  };
}
