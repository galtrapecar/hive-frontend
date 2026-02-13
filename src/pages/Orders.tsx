import { useState } from "react";
import {
  Title,
  Table,
  Pagination,
  Group,
  Text,
  LoadingOverlay,
  Box,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Stack,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  useOrderControllerFindAllQuery,
  useOrderControllerCreateMutation,
} from "../redux/generatedApi";
import { useActiveOrganization } from "../lib/auth-client";

interface Order {
  id: number;
  customer: string;
  price: number;
  weight: number;
  pickupPoint: string;
  pickupTime: string;
  dropoffPoint: string;
  dropoffTime: string;
  description?: string;
}

interface PaginatedResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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

const LIMIT = 10;

export default function Orders() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const { data: activeOrg } = useActiveOrganization();

  const {
    data: raw,
    isLoading,
    refetch,
  } = useOrderControllerFindAllQuery({
    page: String(page),
    limit: String(LIMIT),
  });

  const [createOrder, { isLoading: isCreating }] =
    useOrderControllerCreateMutation();

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
    close();
    refetch();
  };

  const response = raw as PaginatedResponse | undefined;
  const orders = response?.data ?? [];
  const totalPages = response?.meta?.totalPages ?? 1;

  return (
    <Box pos="relative">
      <Group justify="space-between" mb="md">
        <Title order={2}>Orders</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Order
        </Button>
      </Group>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} />

        {!isLoading && orders.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No orders found.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Weight</Table.Th>
                <Table.Th>Pickup</Table.Th>
                <Table.Th>Dropoff</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>{order.customer}</Table.Td>
                  <Table.Td>{order.price}</Table.Td>
                  <Table.Td>{order.weight}</Table.Td>
                  <Table.Td>{order.pickupPoint}</Table.Td>
                  <Table.Td>{order.dropoffPoint}</Table.Td>
                  <Table.Td>{order.description ?? "—"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Box>

      <Group justify="center" mt="md">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      <Modal opened={opened} onClose={close} title="Add Order" size="lg">
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
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" loading={isCreating}>
                Create Order
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
