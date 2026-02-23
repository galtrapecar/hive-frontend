import {
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Stack,
  Group,
  Button,
  Text,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconUpload, IconFileText, IconX } from "@tabler/icons-react";
import { useOrderControllerCreateMutation } from "../redux/generatedApi";
import { useAiControllerExtractOrderFromFileMutation } from "../redux/generatedApi";
import { useActiveOrganization } from "../lib/auth-client";

interface OrderFormValues {
  customer: string;
  price: number;
  weight: number;
  pickupPoint: string;
  pickupTime: Date | null;
  dropoffPoint: string;
  dropoffTime: Date | null;
  description: string;
}

interface AddOrderModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddOrderModal({
  opened,
  onClose,
  onCreated,
}: AddOrderModalProps) {
  const { data: activeOrg } = useActiveOrganization();

  const [createOrder, { isLoading: isCreating }] =
    useOrderControllerCreateMutation();

  const [extractOrder, { isLoading: isExtracting }] =
    useAiControllerExtractOrderFromFileMutation();

  const form = useForm<OrderFormValues>({
    mode: "controlled",
    initialValues: {
      customer: "",
      price: 0,
      weight: 0,
      pickupPoint: "",
      pickupTime: null,
      dropoffPoint: "",
      dropoffTime: null,
      description: "",
    },
    validate: {
      customer: (v) => (v.trim() ? null : "Customer is required"),
      price: (v) => (v > 0 ? null : "Price must be greater than 0"),
      weight: (v) => (v > 0 ? null : "Weight must be greater than 0"),
      pickupPoint: (v) => (v.trim() ? null : "Pickup point is required"),
      pickupTime: (v) => (v ? null : "Pickup time is required"),
      dropoffPoint: (v) => (v.trim() ? null : "Dropoff point is required"),
      dropoffTime: (v, values) => {
        if (!v) return "Dropoff time is required";
        if (values.pickupTime && v <= values.pickupTime)
          return "Dropoff time must be after pickup time";
        return null;
      },
    },
  });

  const handleSubmit = async (values: OrderFormValues) => {
    if (!activeOrg) return;
    await createOrder({
      createOrderDto: {
        customer: values.customer,
        price: values.price,
        weight: values.weight,
        pickupPoint: values.pickupPoint,
        pickupTime: new Date(values.pickupTime!).toISOString(),
        dropoffPoint: values.dropoffPoint,
        dropoffTime: new Date(values.dropoffTime!).toISOString(),
        description: values.description || undefined,
        organizationId: activeOrg.id,
      },
    }).unwrap();
    form.reset();
    onClose();
    onCreated();
  };

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await extractOrder({
        // @ts-expect-error
        body: formData,
      }).unwrap();

      form.setValues({
        customer: result.customer || "",
        price: result.price || 0,
        weight: result.weight || 0,
        pickupPoint: result.pickupPoint || "",
        pickupTime: result.pickupTime ? new Date(result.pickupTime) : null,
        dropoffPoint: result.dropoffPoint || "",
        dropoffTime: result.dropoffTime ? new Date(result.dropoffTime) : null,
        description: result.description || "",
      });
    } catch {
      // extraction failed – user can still fill manually
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Add Order" size="lg">
      <Box pos="relative">
        <LoadingOverlay visible={isExtracting} />

        <Stack>
          <Dropzone
            onDrop={handleDrop}
            accept={[MIME_TYPES.pdf, MIME_TYPES.xlsx, "text/plain"]}
            maxFiles={1}
            loading={isExtracting}
          >
            <Group
              justify="center"
              gap="xl"
              mih={80}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload size={32} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={32} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFileText size={32} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="sm" inline>
                  Drop a file here or click to upload
                </Text>
                <Text size="xs" c="dimmed" inline mt={4}>
                  PDF, Excel, or text – AI will extract order details
                </Text>
              </div>
            </Group>
          </Dropzone>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Customer"
                placeholder="Customer name"
                withAsterisk
                {...form.getInputProps("customer")}
              />
              <Group grow>
                <NumberInput
                  label="Price"
                  placeholder="0.00"
                  min={0}
                  decimalScale={2}
                  withAsterisk
                  {...form.getInputProps("price")}
                />
                <NumberInput
                  label="Weight"
                  placeholder="0"
                  min={0}
                  withAsterisk
                  {...form.getInputProps("weight")}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Pickup Point"
                  placeholder="Pickup address"
                  withAsterisk
                  {...form.getInputProps("pickupPoint")}
                />
                <DateTimePicker
                  label="Pickup Time"
                  placeholder="Pick date and time"
                  withAsterisk
                  clearable
                  {...form.getInputProps("pickupTime")}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Dropoff Point"
                  placeholder="Dropoff address"
                  withAsterisk
                  {...form.getInputProps("dropoffPoint")}
                />
                <DateTimePicker
                  label="Dropoff Time"
                  placeholder="Pick date and time"
                  withAsterisk
                  clearable
                  {...form.getInputProps("dropoffTime")}
                />
              </Group>
              <Textarea
                label="Description"
                placeholder="Optional notes"
                {...form.getInputProps("description")}
              />
              <Group justify="flex-end">
                <Button variant="default" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" loading={isCreating}>
                  Create Order
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Modal>
  );
}
