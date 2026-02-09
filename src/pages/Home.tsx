import { Title, Text, Stack } from "@mantine/core";
import { useSession } from "../lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Stack gap="md">
      <Title order={2}>Welcome to Hive</Title>
      <Text c="dimmed">
        Signed in as {session?.user?.name ?? session?.user?.email}
      </Text>
    </Stack>
  );
}
