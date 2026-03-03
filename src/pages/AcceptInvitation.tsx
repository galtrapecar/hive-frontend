import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Paper,
  Container,
  Stack,
  Text,
  Title,
  Center,
  Loader,
  Group,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { IconMailOpened } from "@tabler/icons-react";
import authClient, { organization, useSession } from "../lib/auth-client";

interface InvitationDetails {
  id: string;
  organizationName: string;
  inviterEmail: string;
  role: string;
  organizationId: string;
}

export default function AcceptInvitation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("id");
  const { data: session, isPending: sessionPending } = useSession();

  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionPending) return;
    if (!session) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/accept-invitation?id=${invitationId}`)}`,
        { replace: true },
      );
      return;
    }
    if (!invitationId) {
      setError("No invitation ID provided");
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const { data, error } = await organization.getInvitation({
          query: { id: invitationId },
        });
        if (error) {
          setError(error.message || "Failed to load invitation");
          return;
        }
        setInvitation(data as InvitationDetails);
      } catch {
        setError("Failed to load invitation");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [session, sessionPending, invitationId, navigate]);

  const handleAccept = async () => {
    if (!invitation) return;
    setActionLoading(true);
    try {
      const { error } = await organization.acceptInvitation({
        invitationId: invitation.id,
      });
      if (error) {
        setError(error.message || "Failed to accept invitation");
        return;
      }
      await organization.setActive({
        organizationId: invitation.organizationId,
      });
      navigate("/", { replace: true });
    } catch {
      setError("Failed to accept invitation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!invitation) return;
    setActionLoading(true);
    try {
      const { error } = await organization.rejectInvitation({
        invitationId: invitation.id,
      });
      if (error) {
        setError(error.message || "Failed to reject invitation");
        return;
      }
      navigate("/", { replace: true });
    } catch {
      setError("Failed to reject invitation");
    } finally {
      setActionLoading(false);
    }
  };

  if (sessionPending || loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack align="center" gap="md">
          <ThemeIcon size={48} radius="xl" variant="light" color="orange">
            <IconMailOpened size={28} />
          </ThemeIcon>
          <Title order={3}>Organization Invitation</Title>

          {error ? (
            <>
              <Text c="red" size="sm" ta="center">
                {error}
              </Text>
              <Button variant="default" onClick={() => authClient.signOut()}>
                Log out
              </Button>
            </>
          ) : invitation ? (
            <>
              <Text ta="center" c="dimmed" size="sm">
                You've been invited to join
              </Text>
              <Title order={4}>{invitation.organizationName}</Title>
              <Badge variant="light" size="lg">
                {invitation.role}
              </Badge>
              <Text size="sm" c="dimmed">
                Invited by {invitation.inviterEmail}
              </Text>
              <Group mt="md">
                <Button
                  variant="default"
                  onClick={handleReject}
                  loading={actionLoading}
                >
                  Decline
                </Button>
                <Button onClick={handleAccept} loading={actionLoading}>
                  Accept Invitation
                </Button>
              </Group>
            </>
          ) : (
            <Text c="dimmed">Invitation not found.</Text>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
