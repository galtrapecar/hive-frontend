import { Container, Title, Text, Button, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { signOut, useSession } from "../lib/auth-client";

export default function Home() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Container size="sm" my={40}>
      <Stack align="center" gap="md">
        <Title>Welcome to Hive</Title>
        <Text c="dimmed">
          You are signed in as {session?.user?.email}
        </Text>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </Stack>
    </Container>
  );
}
