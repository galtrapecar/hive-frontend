import {
  Button,
  Box,
  Stack,
  Title,
  Text,
  Center,
  Group,
  Image,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "../lib/auth-client";
import Logo from "../assets/logo-dark.svg?react";
import appleAppStore from "../assets/apple-appstore.svg";
import googlePlayStore from "../assets/google-playstore.svg";

export default function Forbidden() {
  const handleSignOut = async () => {
    await signOut();
    window.location.replace("/login");
  };

  return (
    <Center mih="100vh" bg="white">
      <Box maw={420} w="100%" px="md">
        <Stack align="center" gap="xl">
          <Logo height={64} />

          <Stack align="center" gap="xs">
            <Title order={2} ta="center">
              Welcome, Driver
            </Title>
            <Text c="dimmed" size="sm" ta="center" maw={320}>
              This dashboard is designed for desktop use. To access your routes
              and deliveries, please download the Hive Driver app.
            </Text>
          </Stack>

          <Group gap="md" justify="center">
            <a href="" target="_blank" rel="noopener noreferrer">
              <Image src={appleAppStore} h={48} fit="contain" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <Image src={googlePlayStore} h={48} fit="contain" />
            </a>
          </Group>

          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<IconLogout size={16} />}
            onClick={handleSignOut}
          >
            Log out
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}
