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
import { IconPlus, IconTrash, IconUserPlus } from "@tabler/icons-react";
import {
  useVehicleControllerFindAllQuery,
  useVehicleControllerRemoveMutation,
  type PaginatedVehicleResponseDto,
  type VehicleResponseDto,
} from "../redux/generatedApi";
import AddVehicleModal from "../components/AddVehicleModal";
import AssignDriverModal from "../components/AssignDriverModal";
import ActionMenu from "../components/ActionMenu";
import { useActiveOrganization } from "../lib/auth-client";

const LIMIT = 10;

const VEHICLE_STATUS_COLOR: Record<VehicleResponseDto["status"], string> = {
  ACTIVE: "green",
  INACTIVE: "gray",
};

export function Vehicles() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [assignOpened, { open: openAssign, close: closeAssign }] =
    useDisclosure(false);
  const [assignVehicleId, setAssignVehicleId] = useState<number | null>(null);
  const { data: activeOrg } = useActiveOrganization();

  const {
    data: raw,
    isLoading,
    refetch,
  } = useVehicleControllerFindAllQuery(
    {
      organizationId: activeOrg?.id || "",
      page: String(page),
      limit: String(LIMIT),
    },
    {
      skip: !activeOrg?.id,
    },
  );

  const [deleteVehicle] = useVehicleControllerRemoveMutation();

  const handleDelete = async (vehicleId: number) => {
    if (!activeOrg?.id) return;
    await deleteVehicle({
      id: vehicleId,
      organizationId: activeOrg.id,
    }).unwrap();
    refetch();
  };

  const response = raw as PaginatedVehicleResponseDto | undefined;
  const vehicles = response?.data ?? [];
  const totalPages = response?.meta?.totalPages ?? 1;

  return (
    <Box pos="relative">
      <Group justify="space-between" mb="md">
        <Title order={2}>Vehicles</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Vehicle
        </Button>
      </Group>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} />

        {!isLoading && vehicles.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No vehicles found.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Registration Plate</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Make / Model</Table.Th>
                <Table.Th>Payload (kg)</Table.Th>
                <Table.Th>Gross Weight (kg)</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {vehicles.map((vehicle) => (
                <Table.Tr key={vehicle.id}>
                  <Table.Td>{vehicle.registrationPlate}</Table.Td>
                  <Table.Td>{vehicle.type.replaceAll("_", " ")}</Table.Td>
                  <Table.Td>
                    {[vehicle.make, vehicle.model].filter(Boolean).join(" ") ||
                      "—"}
                  </Table.Td>
                  <Table.Td>{vehicle.payloadCapacity ?? "—"}</Table.Td>
                  <Table.Td>{vehicle.grossWeight ?? "—"}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={VEHICLE_STATUS_COLOR[vehicle.status]}
                      variant="light"
                    >
                      {vehicle.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionMenu
                      groups={[
                        {
                          items: [
                            {
                              label: "Assign driver",
                              leftSection: <IconUserPlus size={16} />,
                              onClick: () => {
                                setAssignVehicleId(vehicle.id);
                                openAssign();
                              },
                            },
                          ],
                        },
                        {
                          label: "Danger Zone",
                          items: [
                            {
                              label: "Delete",
                              leftSection: <IconTrash size={16} />,
                              danger: true,
                              onConfirm: () => handleDelete(vehicle.id),
                              confirmTitle: "Delete vehicle?",
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

      <AddVehicleModal opened={opened} onClose={close} onCreated={refetch} />
      <AssignDriverModal
        opened={assignOpened}
        onClose={closeAssign}
        vehicleId={assignVehicleId}
        onAssigned={refetch}
      />
    </Box>
  );
}
