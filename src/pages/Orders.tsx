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
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  useOrderControllerFindAllQuery,
  useOrderControllerRemoveMutation,
} from "../redux/generatedApi";
import AddOrderModal from "../components/AddOrderModal";
import ActionMenu from "../components/ActionMenu";
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
  plan?: { id: number; status: "PENDING" | "IN_PROGRESS" | "COMPLETED" } | null;
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

const PLAN_STATUS_COLOR: Record<string, string> = {
  PENDING: "yellow",
  IN_PROGRESS: "blue",
  COMPLETED: "green",
};

const LIMIT = 10;

export default function Orders() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const { data: activeOrg } = useActiveOrganization();

  const {
    data: raw,
    isLoading,
    refetch,
  } = useOrderControllerFindAllQuery(
    {
      organizationId: activeOrg?.id || "",
      page: String(page),
      limit: String(LIMIT),
    },
    {
      skip: !activeOrg?.id,
    }
  );

  const [deleteOrder] = useOrderControllerRemoveMutation();

  const handleDelete = async (orderId: number) => {
    if (!activeOrg?.id) return;
    await deleteOrder({
      id: orderId,
      organizationId: activeOrg.id
    }).unwrap();
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
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
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
                  <Table.Td>
                    <Badge
                      color={
                        order.plan
                          ? PLAN_STATUS_COLOR[order.plan.status]
                          : "gray"
                      }
                      variant="light"
                    >
                      {order.plan
                        ? order.plan.status.replace("_", " ")
                        : "Unplanned"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionMenu
                      groups={[
                        {
                          label: "Danger Zone",
                          items: [
                            {
                              label: "Delete",
                              leftSection: <IconTrash size={16} />,
                              danger: true,
                              onConfirm: () => handleDelete(order.id),
                              confirmTitle: "Delete order?",
                              confirmDescription:
                                "This action cannot be undone.",
                            },
                          ],
                        },
                      ]}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Box>

      <Group justify="center" mt="md">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      <AddOrderModal opened={opened} onClose={close} onCreated={refetch} />
    </Box>
  );
}
