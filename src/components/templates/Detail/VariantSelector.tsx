"use client";

import { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { VariantDTO } from "@/types/type";

type VariantSelectorProps = {
  variants: VariantDTO[];
  onVariantChange?: (variant: VariantDTO) => void;
  className?: string;
};

export default function VariantSelector({
  variants,
  onVariantChange,
  className = "",
}: VariantSelectorProps) {
  const [attribute, setAttribute] = useState<Record<string, string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );
  const [currentVariant, setCurrentVariant] = useState<VariantDTO | null>(null);

  const fillMissingSelectedOptions = (
    attributes: Record<string, string[]>,
    selected: Record<string, string>
  ) => {
    const filled: Record<string, string> = { ...selected };
    Object.entries(attributes).forEach(([key, values]) => {
      if (!filled[key] && values.length > 0) {
        filled[key] = values[0];
      }
    });
    return filled;
  };

  useEffect(() => {
    if (!variants.length) {
      setAttribute({});
      setSelectedOptions({});
      setCurrentVariant(null);
      return;
    }

    const attributeMap: Record<string, Set<string>> = {};
    variants.forEach((v) => {
      Object.entries(v.valuevariant).forEach(([key, value]) => {
        if (!attributeMap[key]) {
          attributeMap[key] = new Set();
        }
        attributeMap[key].add(value);
      });
    });

    const attributes = Object.fromEntries(
      Object.entries(attributeMap).map(([key, values]) => [key, [...values]])
    );
    const initialSelected = fillMissingSelectedOptions(
      attributes,
      variants[0].valuevariant
    );
    const match =
      variants.find((v) =>
        Object.entries(initialSelected).every(
          ([key, val]) => v.valuevariant[key] === val
        )
      ) ?? variants[0];

    setAttribute(attributes);
    setSelectedOptions(
      fillMissingSelectedOptions(attributes, match.valuevariant)
    );
    setCurrentVariant(match);
  }, [variants]);

  useEffect(() => {
    if (currentVariant && onVariantChange) {
      onVariantChange(currentVariant);
    }
  }, [currentVariant, onVariantChange]);

  const handleOptionChange = (key: string, value: string) => {
    const nextSelected = fillMissingSelectedOptions(attribute, {
      ...selectedOptions,
      [key]: value,
    });

    const exactMatch = variants.find((v) =>
      Object.entries(nextSelected).every(
        ([k, val]) => v.valuevariant[k] === val
      )
    );

    if (exactMatch) {
      setSelectedOptions(nextSelected);
      setCurrentVariant({ ...exactMatch });
      return;
    }

    const candidates = variants.filter((v) => v.valuevariant[key] === value);
    if (candidates.length) {
      const best = candidates.reduce((bestMatch, current) => {
        const bestScore = Object.entries(nextSelected).reduce(
          (score, [k, val]) =>
            score + (bestMatch.valuevariant[k] === val ? 1 : 0),
          0
        );
        const currentScore = Object.entries(nextSelected).reduce(
          (score, [k, val]) =>
            score + (current.valuevariant[k] === val ? 1 : 0),
          0
        );
        return currentScore > bestScore ? current : bestMatch;
      }, candidates[0]);

      setSelectedOptions(
        fillMissingSelectedOptions(attribute, best.valuevariant)
      );
      setCurrentVariant({ ...best });
      return;
    }

    setSelectedOptions(
      fillMissingSelectedOptions(attribute, variants[0].valuevariant)
    );
    setCurrentVariant({ ...variants[0] });
  };

  if (!variants.length) return null;

  return (
    <div
      className={`grid gap-6 ${className}`}
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
    >
      {Object.entries(attribute).map(([key, values]) => (
        <div key={key}>
          <p className="font-semibold mb-1 text-[#191C1F]">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </p>
          <Dropdown active={selectedOptions[key] ?? ""}>
            {values.map((value) => (
              <div
                key={value}
                className="cursor-pointer pl-2"
                onClick={() => handleOptionChange(key, value)}
              >
                <p className="text-[#475156]">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </p>
              </div>
            ))}
          </Dropdown>
        </div>
      ))}
    </div>
  );
}
