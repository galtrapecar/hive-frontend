import { useEffect } from "react";
import {
  Outlet,
  NavLink as RouterNavLink,
  useNavigate,
} from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Stack,
  Box,
  Avatar,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUsers, IconLogout, IconFile3d } from "@tabler/icons-react";
import Logo from "../assets/logo-dark.svg?react";
import {
  signOut,
  useSession,
  useActiveOrganization,
  useListOrganizations,
  organization,
} from "../lib/auth-client";

const menuItems = [
  { label: "Plans", icon: IconFile3d, to: "/" },
  { label: "Drivers", icon: IconUsers, to: "/drivers" },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const { data: session } = useSession();
  const { data: activeOrg } = useActiveOrganization();
  const { data: organizations } = useListOrganizations();

  useEffect(() => {
    if (!activeOrg && organizations && organizations.length > 0) {
      organization.setActive({ organizationId: organizations[0].id });
    }
  }, [activeOrg, organizations]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo height={24} />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text size="xs" fw={500} c="dimmed" tt="uppercase" mb={4}>
            Organization
          </Text>
          <Text fw={600} size="sm" mb="md" truncate>
            {activeOrg?.name ?? "Loading..."}
          </Text>
          <Divider mb="sm" />
        </AppShell.Section>

        <AppShell.Section grow>
          <Stack gap={4}>
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                component={RouterNavLink}
                to={item.to}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                style={{ borderRadius: 6 }}
                end={item.to === "/"}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Divider mb="sm" />
          <Box>
            <Group gap="sm" mb="xs">
              <Avatar radius="xl" size="sm" color="orange">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </Avatar>
              <Box
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Text size="sm" fw={500} truncate>
                  {session?.user?.name}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {session?.user?.email}
                </Text>
              </Box>
            </Group>
            <UnstyledButton
              onClick={handleSignOut}
              w="100%"
              py={6}
              px={8}
              style={{ borderRadius: 6 }}
            >
              <Group gap="xs">
                <IconLogout size={16} stroke={1.5} />
                <Text size="sm">Log out</Text>
              </Group>
            </UnstyledButton>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
