import { useState } from "react";
import {
  Modal,
  TextInput,
  Stack,
  Group,
  Button,
  Text,
  LoadingOverlay,
  Box,
  UnstyledButton,
  Badge,
} from "@mantine/core";
import { IconSearch, IconCheck } from "@tabler/icons-react";
import _ from "lodash";
import {
  useDriverControllerFindAllQuery,
  useDriverControllerAssignVehicleMutation,
  type DriverResponseDto,
} from "../redux/generatedApi";
import { useActiveOrganization } from "../lib/auth-client";

interface AssignDriverModalProps {
  opened: boolean;
  onClose: () => void;
  vehicleId: number | null;
  onAssigned: () => void;
}

export default function AssignDriverModal({
  opened,
  onClose,
  vehicleId,
  onAssigned,
}: AssignDriverModalProps) {
  const { data: activeOrg } = useActiveOrganization();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSetSearch = _.debounce((value: string) => {
    setDebouncedSearch(value);
  }, 300);

  const { data: raw, isLoading } = useDriverControllerFindAllQuery(
    {
      organizationId: activeOrg?.id || "",
      page: "1",
      limit: "50",
      search: debouncedSearch || undefined,
    },
    {
      skip: !activeOrg?.id || !opened,
    },
  );

  const [assignVehicle, { isLoading: isAssigning }] =
    useDriverControllerAssignVehicleMutation();

  const drivers = (raw as any)?.data ?? [];

  const handleAssign = async (driver: DriverResponseDto) => {
    if (!activeOrg?.id || vehicleId === null) return;
    await assignVehicle({
      memberId: driver.memberId,
      assignVehicleDto: {
        vehicleId,
        organizationId: activeOrg.id,
      },
    }).unwrap();
    handleClose();
    onAssigned();
  };

  const handleClose = () => {
    setSearch("");
    setDebouncedSearch("");
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Assign Driver">
      <Stack>
        <TextInput
          placeholder="Search drivers..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            debouncedSetSearch(e.currentTarget.value);
          }}
        />

        <Box pos="relative" mih={100}>
          <LoadingOverlay visible={isLoading || isAssigning} />

          {!isLoading && drivers.length === 0 ? (
            <Text c="dimmed" ta="center" py="md">
              No drivers found.
            </Text>
          ) : (
            <Stack gap="xs">
              {drivers.map((driver: DriverResponseDto) => (
                <UnstyledButton
                  key={driver.memberId}
                  onClick={() => handleAssign(driver)}
                  p="sm"
                  style={(theme: any) => ({
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.gray[3]}`,
                    "&:hover": {
                      backgroundColor: theme.colors.gray[0],
                    },
                  })}
                >
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>
                        {driver.fullName || driver.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {driver.email}
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          )}
        </Box>

        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
