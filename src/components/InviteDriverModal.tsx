import { Modal, Stack, Group, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { organization, useActiveOrganization } from "../lib/auth-client";
import { useState } from "react";

interface InviteDriverModalProps {
  opened: boolean;
  onClose: () => void;
  onInvited: () => void;
}

export default function InviteDriverModal({
  opened,
  onClose,
  onInvited,
}: InviteDriverModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: activeOrg } = useActiveOrganization();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
    },
    validate: {
      email: (v) =>
        /^\S+@\S+\.\S+$/.test(v.trim()) ? null : "Valid email is required",
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    if (!activeOrg?.id) return;
    setIsLoading(true);
    try {
      await organization.inviteMember({
        email: values.email.trim(),
        role: "driver" as "member",
      });

      form.reset();
      onClose();
      onInvited();
    } catch {
      form.setFieldError("email", "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Invite Driver">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="driver@example.com"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
