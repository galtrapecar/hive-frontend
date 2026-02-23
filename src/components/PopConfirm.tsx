import { Popover, Button, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode } from "react";

interface PopConfirmProps {
  children: ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function PopConfirm({
  children,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: PopConfirmProps) {
  const [opened, { close, open }] = useDisclosure(false);

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <Popover opened={opened} onChange={open} position="bottom" withArrow>
      <Popover.Target>
        <div onClick={open}>{children}</div>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="sm">
          <div>
            <Text size="sm" fw={500}>
              {title}
            </Text>
            {description && (
              <Text size="xs" c="dimmed" mt={4}>
                {description}
              </Text>
            )}
          </div>
          <Button.Group>
            <Button variant="default" size="xs" onClick={close}>
              {cancelLabel}
            </Button>
            <Button color="red" size="xs" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </Button.Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
