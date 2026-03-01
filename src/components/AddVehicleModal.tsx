import { useState } from "react";
import {
  Modal,
  NumberInput,
  TextInput,
  Select,
  Stack,
  Group,
  Button,
  Box,
  Collapse,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import {
  useVehicleControllerCreateMutation,
  type CreateVehicleDto,
} from "../redux/generatedApi";
import { useActiveOrganization } from "../lib/auth-client";

const VEHICLE_TYPES: { value: CreateVehicleDto["type"]; label: string }[] = [
  { value: "BOX_TRUCK", label: "Box Truck" },
  { value: "WALKING_FLOOR", label: "Walking Floor" },
  { value: "COIL", label: "Coil" },
  { value: "CONTAINER", label: "Container" },
  { value: "CAR_TRANSPORTER", label: "Car Transporter" },
  { value: "TANKER", label: "Tanker" },
  { value: "TARPAULIN", label: "Tarpaulin" },
  { value: "FLATBED", label: "Flatbed" },
  { value: "REFRIGERATOR", label: "Refrigerator" },
  { value: "TIPPER", label: "Tipper" },
  { value: "SILO", label: "Silo" },
  { value: "OTHER", label: "Other" },
];

const ADR_CLASSES: {
  value: NonNullable<CreateVehicleDto["adrClass"]>;
  label: string;
}[] = [
  { value: "CLASS_1", label: "Class 1 – Explosives" },
  { value: "CLASS_2", label: "Class 2 – Gases" },
  { value: "CLASS_3", label: "Class 3 – Flammable Liquids" },
  { value: "CLASS_4", label: "Class 4 – Flammable Solids" },
  { value: "CLASS_5", label: "Class 5 – Oxidizers" },
  { value: "CLASS_6", label: "Class 6 – Toxic Substances" },
  { value: "CLASS_7", label: "Class 7 – Radioactive" },
  { value: "CLASS_8", label: "Class 8 – Corrosives" },
  { value: "CLASS_9", label: "Class 9 – Miscellaneous" },
];

interface VehicleFormValues {
  registrationPlate: string;
  type: CreateVehicleDto["type"];
  make: string;
  model: string;
  year: number | "";
  vin: string;
  internalNumber: string;
  height: number | "";
  width: number | "";
  length: number | "";
  payloadCapacity: number | "";
  grossWeight: number | "";
  loadingMeters: number | "";
  volume: number | "";
  axles: string;
  adrClass: CreateVehicleDto["adrClass"] | "";
}

interface AddVehicleModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddVehicleModal({
  opened,
  onClose,
  onCreated,
}: AddVehicleModalProps) {
  const { data: activeOrg } = useActiveOrganization();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [createVehicle, { isLoading: isCreating }] =
    useVehicleControllerCreateMutation();

  const form = useForm<VehicleFormValues>({
    mode: "controlled",
    initialValues: {
      registrationPlate: "",
      type: "BOX_TRUCK",
      make: "",
      model: "",
      year: "",
      vin: "",
      internalNumber: "",
      height: "",
      width: "",
      length: "",
      payloadCapacity: "",
      grossWeight: "",
      loadingMeters: "",
      volume: "",
      axles: "",
      adrClass: "",
    },
    validate: {
      registrationPlate: (v) =>
        v.trim() ? null : "Registration plate is required",
      type: (v) => (v ? null : "Vehicle type is required"),
    },
  });

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!activeOrg) return;
    await createVehicle({
      createVehicleDto: {
        organizationId: activeOrg.id,
        registrationPlate: values.registrationPlate,
        type: values.type,
        make: values.make || undefined,
        model: values.model || undefined,
        year: values.year || undefined,
        vin: values.vin || undefined,
        internalNumber: values.internalNumber || undefined,
        height: values.height || undefined,
        width: values.width || undefined,
        length: values.length || undefined,
        payloadCapacity: values.payloadCapacity || undefined,
        grossWeight: values.grossWeight || undefined,
        loadingMeters: values.loadingMeters || undefined,
        volume: values.volume || undefined,
        axles: values.axles ? Number(values.axles) : undefined,
        adrClass: values.adrClass || undefined,
      },
    }).unwrap();
    form.reset();
    onClose();
    onCreated();
  };

  const handleClose = () => {
    form.reset();
    setDetailsOpen(false);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Add Vehicle" size="lg">
      <Box pos="relative">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {/* Required fields */}
            <Group grow>
              <TextInput
                label="Registration Plate"
                placeholder="e.g. AB-123-CD"
                withAsterisk
                {...form.getInputProps("registrationPlate")}
              />
              <Select
                label="Type"
                data={VEHICLE_TYPES}
                withAsterisk
                {...form.getInputProps("type")}
              />
            </Group>

            <UnstyledButton
              onClick={() => setDetailsOpen((o) => !o)}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              {detailsOpen ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )}
              <Text size="xs" c="dimmed">
                Additional details
              </Text>
            </UnstyledButton>
            <Collapse in={detailsOpen}>
              <Stack gap="xs">
                <Group grow>
                  <TextInput
                    label="Make"
                    placeholder="e.g. Mercedes"
                    {...form.getInputProps("make")}
                  />
                  <TextInput
                    label="Model"
                    placeholder="e.g. Actros"
                    {...form.getInputProps("model")}
                  />
                </Group>

                <Group grow>
                  <NumberInput
                    label="Year"
                    placeholder="e.g. 2023"
                    min={1900}
                    max={2100}
                    {...form.getInputProps("year")}
                  />
                  <TextInput
                    label="VIN"
                    placeholder="Vehicle identification number"
                    {...form.getInputProps("vin")}
                  />
                </Group>

                <Group grow>
                  <TextInput
                    label="Internal Number"
                    placeholder="Internal fleet number"
                    {...form.getInputProps("internalNumber")}
                  />
                  <div className="w-full" />
                </Group>
              </Stack>
            </Collapse>

            {/* Dimensions */}
            <Text size="sm" fw={500}>
              Dimensions
            </Text>
            <Group grow>
              <NumberInput
                label="Height (m)"
                placeholder="0"
                min={0}
                decimalScale={2}
                {...form.getInputProps("height")}
              />
              <NumberInput
                label="Width (m)"
                placeholder="0"
                min={0}
                decimalScale={2}
                {...form.getInputProps("width")}
              />
              <NumberInput
                label="Length (m)"
                placeholder="0"
                min={0}
                decimalScale={2}
                {...form.getInputProps("length")}
              />
            </Group>

            {/* Capacity */}
            <Text size="sm" fw={500}>
              Capacity
            </Text>
            <Group grow>
              <NumberInput
                label="Payload Capacity (kg)"
                placeholder="0"
                min={0}
                {...form.getInputProps("payloadCapacity")}
              />
              <NumberInput
                label="Gross Weight (kg)"
                placeholder="0"
                min={0}
                {...form.getInputProps("grossWeight")}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Loading Meters"
                placeholder="0"
                min={0}
                decimalScale={2}
                {...form.getInputProps("loadingMeters")}
              />
              <NumberInput
                label="Volume (m³)"
                placeholder="0"
                min={0}
                decimalScale={2}
                {...form.getInputProps("volume")}
              />
            </Group>

            {/* Specifications */}
            <Text size="sm" fw={500}>
              Specifications
            </Text>
            <Group grow>
              <Select
                label="Axles"
                placeholder="Select"
                data={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                clearable
                {...form.getInputProps("axles")}
              />
              <Select
                label="ADR Class"
                placeholder="None"
                data={ADR_CLASSES}
                clearable
                {...form.getInputProps("adrClass")}
              />
            </Group>

            <Group justify="flex-end">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isCreating}>
                Create Vehicle
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
