import { useState, useEffect } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Group,
  NumberInput,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconMapPin,
  IconTransfer,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import AddressAutocomplete from "./AddressAutocomplete";
import type { GeocodeResponseItemDto } from "../redux/generatedApi";
import { useLazyRoutingControllerReverseGeocodeQuery } from "../redux/generatedApi";

interface EditableLocationProps {
  label: string;
  color: string;
  name: string;
  time: string;
  lat: number | null;
  lng: number | null;
  onConfirm: (name: string, lat: number, lng: number) => void | Promise<void>;
  onEditingChange?: (editing: boolean) => void;
  draggedCoords?: { lat: number; lng: number } | null;
}

export const EditableLocation = ({
  label,
  color,
  name,
  time,
  lat,
  lng,
  onConfirm,
  onEditingChange,
  draggedCoords,
}: EditableLocationProps) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coordsOpen, setCoordsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const [selectedItem, setSelectedItem] =
    useState<GeocodeResponseItemDto | null>(null);
  const [reverseGeocode] = useLazyRoutingControllerReverseGeocodeQuery();

  useEffect(() => {
    if (draggedCoords && editing) {
      setSelectedItem({
        name: inputValue,
        lat: draggedCoords.lat,
        lng: draggedCoords.lng,
      });
      const coordsFallback = `${draggedCoords.lat.toFixed(5)}, ${draggedCoords.lng.toFixed(5)}`;
      reverseGeocode({
        lat: draggedCoords.lat,
        lng: draggedCoords.lng,
        limit: 1,
      })
        .unwrap()
        .then((results) => {
          if (results.length > 0) {
            const r = results[0];
            const label = [r.name, r.city, r.country]
              .filter(Boolean)
              .join(", ");
            setInputValue(label);
            setSelectedItem({
              name: label,
              lat: draggedCoords.lat,
              lng: draggedCoords.lng,
            });
          } else {
            setInputValue(coordsFallback);
          }
        })
        .catch(() => {
          setInputValue(coordsFallback);
        });
    }
  }, [draggedCoords?.lat, draggedCoords?.lng]);

  const handleStartEditing = () => {
    setInputValue(name);
    setSelectedItem(null);
    setEditing(true);
    onEditingChange?.(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setInputValue(name);
    setSelectedItem(null);
    onEditingChange?.(false);
  };

  const handleConfirm = async () => {
    if (selectedItem) {
      setSaving(true);
      try {
        await onConfirm(inputValue, selectedItem.lat, selectedItem.lng);
        setEditing(false);
        setSelectedItem(null);
        onEditingChange?.(false);
      } finally {
        setSaving(false);
      }
    }
  };

  if (editing) {
    return (
      <Box>
        <AddressAutocomplete
          label={label}
          placeholder="Search address..."
          value={inputValue}
          onChange={setInputValue}
          onSelect={(item) => {
            setSelectedItem(item);
          }}
        />
        {(() => {
          const displayLat = selectedItem?.lat ?? lat;
          const displayLng = selectedItem?.lng ?? lng;
          return (
            <>
              <UnstyledButton
                onClick={() => setCoordsOpen((o) => !o)}
                mt={4}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                {coordsOpen ? (
                  <IconChevronDown size={14} />
                ) : (
                  <IconChevronRight size={14} />
                )}
                <Text size="xs" c="dimmed">
                  Coordinates
                  {displayLat != null &&
                    displayLng != null &&
                    ` (${displayLat.toFixed(4)}, ${displayLng.toFixed(4)})`}
                </Text>
              </UnstyledButton>
              <Collapse in={coordsOpen}>
                <Group grow mt={4}>
                  <NumberInput
                    label="Latitude"
                    placeholder="0.000000"
                    decimalScale={6}
                    step={0.0001}
                    value={displayLat ?? ""}
                    readOnly
                    size="xs"
                  />
                  <NumberInput
                    label="Longitude"
                    placeholder="0.000000"
                    decimalScale={6}
                    step={0.0001}
                    value={displayLng ?? ""}
                    readOnly
                    size="xs"
                  />
                </Group>
              </Collapse>
            </>
          );
        })()}
        <Group gap="xs" mt="xs">
          <Button
            size="xs"
            variant="light"
            color="green"
            leftSection={<IconCheck size={14} />}
            onClick={handleConfirm}
            disabled={!selectedItem}
            loading={saving}
          >
            Confirm
          </Button>
          <Button
            size="xs"
            variant="light"
            color="gray"
            leftSection={<IconX size={14} />}
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
        </Group>
      </Box>
    );
  }

  return (
    <Group gap="sm">
      <ThemeIcon variant="light" color={color} size="lg" radius="md">
        <IconMapPin size={18} />
      </ThemeIcon>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500}>
          {name}
        </Text>
        <Text size="xs" c="dimmed">
          {dayjs(time).format("MMM D, YYYY h:mm A")}
        </Text>
      </Box>
      <ActionIcon variant="subtle" color="gray" onClick={handleStartEditing}>
        <IconTransfer size={16} />
      </ActionIcon>
    </Group>
  );
};
