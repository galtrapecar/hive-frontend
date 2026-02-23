import { useState, useCallback, useRef } from "react";
import { Autocomplete } from "@mantine/core";
import { debounce } from "lodash";
import { useLazyRoutingControllerGeocodeQuery } from "../redux/generatedApi";
import type { GeocodeResponseItemDto } from "../redux/generatedApi";

interface AddressAutocompleteProps {
  label: string;
  placeholder?: string;
  withAsterisk?: boolean;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: GeocodeResponseItemDto) => void;
  error?: string;
}

export default function AddressAutocomplete({
  label,
  placeholder,
  withAsterisk,
  value,
  onChange,
  onSelect,
  error,
}: AddressAutocompleteProps) {
  const [options, setOptions] = useState<
    { value: string; item: GeocodeResponseItemDto }[]
  >([]);
  const [trigger] = useLazyRoutingControllerGeocodeQuery();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = useCallback(
    debounce(async (q: string) => {
      try {
        const results = await trigger({ q, limit: 5 }).unwrap();
        const mapped = results.map((r) => ({
          value: [r.name, r.city, r.country].filter(Boolean).join(", "),
          item: r,
        }));
        setOptions(mapped);
      } catch {
        setOptions([]);
      }
    }, 300),
    [trigger],
  );

  const handleChange = (val: string) => {
    onChange(val);

    if (val.trim().length < 2) {
      setOptions([]);
      fetchResults.cancel();
      return;
    }

    fetchResults(val);
  };

  const handleOptionSubmit = (val: string) => {
    const match = optionsRef.current.find((o) => o.value === val);
    if (match) {
      onChange(val);
      onSelect(match.item);
    }
  };

  return (
    <Autocomplete
      label={label}
      placeholder={placeholder}
      withAsterisk={withAsterisk}
      value={value}
      onChange={handleChange}
      onOptionSubmit={handleOptionSubmit}
      data={options.map((o) => o.value)}
      error={error}
      filter={({ options }) => options}
    />
  );
}
