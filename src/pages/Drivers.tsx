import { useState, useEffect, useCallback } from "react";
import {
  Title,
  Table,
  Tabs,
  Pagination,
  Group,
  Text,
  LoadingOverlay,
  Box,
  Badge,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconTrash,
  IconX,
  IconUsers,
  IconMail,
  IconCopy,
} from "@tabler/icons-react";
import {
  useDriverControllerFindAllQuery,
  useDriverControllerRemoveMutation,
  type PaginatedDriverResponseDto,
} from "../redux/generatedApi";
import ActionMenu from "../components/ActionMenu";
import InviteDriverModal from "../components/InviteDriverModal";
import { organization, useActiveOrganization } from "../lib/auth-client";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

const LIMIT = 10;

export default function Drivers() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const { data: activeOrg } = useActiveOrganization();

  const {
    data: raw,
    isLoading,
    refetch,
  } = useDriverControllerFindAllQuery(
    {
      organizationId: activeOrg?.id || "",
      page: String(page),
      limit: String(LIMIT),
    },
    {
      skip: !activeOrg?.id,
    },
  );

  const [deleteDriver] = useDriverControllerRemoveMutation();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);

  const fetchInvitations = useCallback(async () => {
    if (!activeOrg?.id) return;
    setInvitationsLoading(true);
    try {
      const { data } = await organization.listInvitations({
        query: { organizationId: activeOrg.id },
      });
      setInvitations((data ?? []).filter((i) => i.status === "pending"));
    } catch {
      // ignore
    } finally {
      setInvitationsLoading(false);
    }
  }, [activeOrg?.id]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleCancelInvitation = async (invitationId: string) => {
    await organization.cancelInvitation({ invitationId });
    fetchInvitations();
  };

  const handleInvited = () => {
    refetch();
    fetchInvitations();
  };

  const handleDelete = async (memberId: string) => {
    if (!activeOrg?.id) return;
    await deleteDriver({
      memberId,
      organizationId: activeOrg.id,
    }).unwrap();
    refetch();
  };

  const response = raw as PaginatedDriverResponseDto | undefined;
  const drivers = response?.data ?? [];
  const totalPages = response?.totalPages ?? 1;

  return (
    <Box pos="relative">
      <Group justify="space-between" mb="md">
        <Title order={2}>Drivers</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Invite Driver
        </Button>
      </Group>

      <Tabs defaultValue="drivers">
        <Tabs.List>
          <Tabs.Tab value="drivers" leftSection={<IconUsers size={16} />}>
            Drivers
          </Tabs.Tab>
          <Tabs.Tab value="invitations" leftSection={<IconMail size={16} />}>
            Pending Invitations
            {invitations.length > 0 && (
              <Badge size="sm" variant="filled" color="orange" ml={6}>
                {invitations.length}
              </Badge>
            )}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="drivers" pt="md">
          <Box pos="relative" mih={200}>
            <LoadingOverlay visible={isLoading} />

            {!isLoading && drivers.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No drivers found.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Joined</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drivers.map((driver) => (
                    <Table.Tr key={driver.memberId}>
                      <Table.Td>{driver.fullName as string}</Table.Td>
                      <Table.Td>{driver.email}</Table.Td>
                      <Table.Td>
                        <Badge variant="light">{driver.role}</Badge>
                      </Table.Td>
                      <Table.Td>
                        {new Date(driver.joinedAt).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>
                        <ActionMenu
                          groups={[
                            {
                              label: "Danger Zone",
                              items: [
                                {
                                  label: "Remove",
                                  leftSection: <IconTrash size={16} />,
                                  danger: true,
                                  onConfirm: () =>
                                    handleDelete(driver.memberId),
                                  confirmTitle: "Remove driver?",
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
        </Tabs.Panel>

        <Tabs.Panel value="invitations" pt="md">
          <Box pos="relative" mih={200}>
            <LoadingOverlay visible={invitationsLoading} />

            {!invitationsLoading && invitations.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No pending invitations.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Invited</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invitations.map((invitation) => (
                    <Table.Tr key={invitation.id}>
                      <Table.Td>{invitation.email}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="yellow">
                          {invitation.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>
                        <ActionMenu
                          groups={[
                            {
                              items: [
                                {
                                  label: "Copy link",
                                  leftSection: <IconCopy size={16} />,
                                  onClick: () => {
                                    const link = `${window.location.origin}/accept-invitation?id=${invitation.id}`;
                                    navigator.clipboard.writeText(link);
                                  },
                                },
                              ],
                            },
                            {
                              label: "Danger Zone",
                              items: [
                                {
                                  label: "Cancel invitation",
                                  leftSection: <IconX size={16} />,
                                  danger: true,
                                  onConfirm: () =>
                                    handleCancelInvitation(invitation.id),
                                  confirmTitle: "Cancel invitation?",
                                  confirmDescription:
                                    "The invitation link will no longer work.",
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
        </Tabs.Panel>
      </Tabs>

      <InviteDriverModal
        opened={opened}
        onClose={close}
        onInvited={handleInvited}
      />
    </Box>
  );
}
