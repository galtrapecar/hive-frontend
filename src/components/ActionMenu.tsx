import { Menu, ActionIcon, Popover, Stack, Text, Button, Box } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { type ReactNode, useState, cloneElement, isValidElement } from "react";

interface BaseActionMenuItem {
  label: string;
  leftSection?: ReactNode;
  disabled?: boolean;
}

interface RegularActionMenuItem extends BaseActionMenuItem {
  danger?: false;
  onClick: () => void;
}

interface DangerActionMenuItem extends BaseActionMenuItem {
  danger: true;
  onConfirm: () => void;
  confirmTitle?: string;
  confirmDescription?: string;
}

export type ActionMenuItem = RegularActionMenuItem | DangerActionMenuItem;

export interface ActionMenuGroup {
  label?: string;
  items: ActionMenuItem[];
}

interface ActionMenuProps {
  groups: ActionMenuGroup[];
  disabled?: boolean;
}

export default function ActionMenu({ groups, disabled }: ActionMenuProps) {
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const handleItemClick = (
    item: ActionMenuItem,
    groupIndex: number,
    itemIndex: number
  ) => {
    if (item.danger) {
      setConfirmKey(`${groupIndex}-${itemIndex}`);
    } else {
      item.onClick();
    }
  };

  const handleConfirm = (item: DangerActionMenuItem) => {
    item.onConfirm();
    setConfirmKey(null);
  };

  const isDangerGroup = (group: ActionMenuGroup) =>
    group.items.some((item) => item.danger);

  const getLeftSection = (item: ActionMenuItem) => {
    if (!item.leftSection) return undefined;

    if (item.danger && isValidElement(item.leftSection)) {
      return (
        <Box c="red">
          {cloneElement(item.leftSection as React.ReactElement)}
        </Box>
      );
    }

    return item.leftSection;
  };

  return (
    <Popover
      opened={confirmKey !== null}
      onChange={(opened) => !opened && setConfirmKey(null)}
      position="bottom"
      withArrow
    >
      <Popover.Target>
        <div>
          <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            disabled={disabled}
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" disabled={disabled}>
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {groups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {group.label && (
                    <Menu.Label c={isDangerGroup(group) ? "red" : undefined}>
                      {group.label}
                    </Menu.Label>
                  )}
                  {group.items.map((item, itemIndex) => (
                    <Menu.Item
                      key={itemIndex}
                      leftSection={getLeftSection(item)}
                      onClick={() => handleItemClick(item, groupIndex, itemIndex)}
                      disabled={item.disabled}
                      color={item.danger ? "red" : undefined}
                    >
                      {item.label}
                    </Menu.Item>
                  ))}
                  {groupIndex < groups.length - 1 && <Menu.Divider />}
                </div>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>
      </Popover.Target>

      <Popover.Dropdown>
        {confirmKey !== null &&
          (() => {
            const [groupIdx, itemIdx] = confirmKey.split("-").map(Number);
            const item = groups[groupIdx]?.items[itemIdx];
            if (item && item.danger) {
              return (
                <Stack gap="sm">
                  <div>
                    <Text size="sm" fw={500}>
                      {item.confirmTitle || "Are you sure?"}
                    </Text>
                    {item.confirmDescription && (
                      <Text size="xs" c="dimmed" mt={4}>
                        {item.confirmDescription}
                      </Text>
                    )}
                  </div>
                  <Button.Group>
                    <Button
                      variant="default"
                      size="xs"
                      onClick={() => setConfirmKey(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="red"
                      size="xs"
                      onClick={() => handleConfirm(item)}
                    >
                      Confirm
                    </Button>
                  </Button.Group>
                </Stack>
              );
            }
            return null;
          })()}
      </Popover.Dropdown>
    </Popover>
  );
}
