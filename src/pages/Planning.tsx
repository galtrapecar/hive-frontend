import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AppShell,
  Box,
  Divider,
  Group,
  LoadingOverlay,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconClock,
  IconMapPin,
  IconPackage,
  IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Logo from "../assets/logo-dark.svg?react";
import { useOrderControllerFindOneQuery } from "../redux/generatedApi";
import { useActiveOrganization } from "../lib/auth-client";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";

export default function Planning() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data: activeOrg } = useActiveOrganization();
  const { data: order, isLoading } = useOrderControllerFindOneQuery(
    {
      id: Number(orderId),
      organizationId: activeOrg?.id || "",
    },
    {
      skip: !activeOrg?.id || !orderId,
    },
  );

  const pickupCoords =
    order?.pickupLat != null && order?.pickupLng != null
      ? { lat: Number(order.pickupLat), lng: Number(order.pickupLng) }
      : null;

  const dropoffCoords =
    order?.dropoffLat != null && order?.dropoffLng != null
      ? { lat: Number(order.dropoffLat), lng: Number(order.dropoffLng) }
      : null;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      console.log(1);

      return;
    }

    if (pickupCoords && dropoffCoords) {
      map.fitBounds(
        [
          [
            Math.min(pickupCoords.lng, dropoffCoords.lng),
            Math.min(pickupCoords.lat, dropoffCoords.lat),
          ],
          [
            Math.max(pickupCoords.lng, dropoffCoords.lng),
            Math.max(pickupCoords.lat, dropoffCoords.lat),
          ],
        ],
        { padding: 80, duration: 1000 },
      );
    } else if (pickupCoords) {
      map.flyTo({
        center: [pickupCoords.lng, pickupCoords.lat],
        zoom: 13,
        duration: 1000,
      });
    } else if (dropoffCoords) {
      map.flyTo({
        center: [dropoffCoords.lng, dropoffCoords.lat],
        zoom: 13,
        duration: 1000,
      });
    }
  }, [
    pickupCoords?.lat,
    pickupCoords?.lng,
    dropoffCoords?.lat,
    dropoffCoords?.lng,
    mapLoaded,
  ]);

  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding={0}>
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Box mb="md">
            <Logo height={24} />
          </Box>
        </AppShell.Section>

        <AppShell.Section>
          <NavLink
            label="Back to orders"
            leftSection={<IconArrowLeft size={18} stroke={1.5} />}
            onClick={() => navigate("/orders")}
            style={{ borderRadius: 6 }}
          />
        </AppShell.Section>

        <Divider my="sm" />

        <AppShell.Section grow>
          <Box pos="relative" mih={100}>
            <LoadingOverlay visible={isLoading} />

            {order && (
              <>
                <Group gap="sm" mb="sm">
                  <ThemeIcon
                    variant="light"
                    color="orange"
                    size="lg"
                    radius="md"
                  >
                    <IconUser size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed">
                      Customer
                    </Text>
                    <Text size="sm" fw={600}>
                      {order.customer}
                    </Text>
                  </Box>
                </Group>

                <Accordion variant="subtle" defaultValue="details">
                  <Accordion.Item value="details">
                    <Accordion.Control px={0}>
                      <Text size="xs" fw={500} c="dimmed" tt="uppercase">
                        Order details
                      </Text>
                    </Accordion.Control>
                    <Accordion.Panel px={0}>
                      <Stack gap="md">
                        <Group gap="sm">
                          <ThemeIcon
                            variant="light"
                            color="green"
                            size="lg"
                            radius="md"
                          >
                            <IconMapPin size={18} />
                          </ThemeIcon>
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text size="xs" c="dimmed">
                              Pickup
                            </Text>
                            <Text size="sm" fw={500} truncate>
                              {order.pickupPoint}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {dayjs(order.pickupTime).format(
                                "MMM D, YYYY h:mm A",
                              )}
                            </Text>
                          </Box>
                        </Group>

                        <Group gap="sm">
                          <ThemeIcon
                            variant="light"
                            color="red"
                            size="lg"
                            radius="md"
                          >
                            <IconMapPin size={18} />
                          </ThemeIcon>
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text size="xs" c="dimmed">
                              Dropoff
                            </Text>
                            <Text size="sm" fw={500} truncate>
                              {order.dropoffPoint}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {dayjs(order.dropoffTime).format(
                                "MMM D, YYYY h:mm A",
                              )}
                            </Text>
                          </Box>
                        </Group>

                        <Divider />

                        <Group justify="space-between">
                          <Group gap="xs">
                            <IconPackage
                              size={16}
                              color="var(--mantine-color-dimmed)"
                            />
                            <Text size="sm" c="dimmed">
                              Weight
                            </Text>
                          </Group>
                          <Text size="sm" fw={500}>
                            {order.weight} kg
                          </Text>
                        </Group>

                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">
                            Price
                          </Text>
                          <Text size="sm" fw={600}>
                            ${order.price.toFixed(2)}
                          </Text>
                        </Group>

                        {order.description && (
                          <>
                            <Divider />
                            <Box>
                              <Text size="xs" c="dimmed" mb={4}>
                                Description
                              </Text>
                              <Text size="sm">{order.description}</Text>
                            </Box>
                          </>
                        )}

                        <Divider />

                        <Group gap="xs">
                          <IconClock
                            size={14}
                            color="var(--mantine-color-dimmed)"
                          />
                          <Text size="xs" c="dimmed">
                            Created{" "}
                            {dayjs(order.createdAt).format("MMM D, YYYY")}
                          </Text>
                        </Group>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </>
            )}
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main style={{ height: "100vh" }}>
        <Map
          ref={mapRef}
          initialViewState={{ latitude: 0, longitude: 0, zoom: 13 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          onLoad={() => setMapLoaded(true)}
        >
          {pickupCoords && (
            <Marker longitude={pickupCoords.lng} latitude={pickupCoords.lat}>
              <IconMapPin
                size={28}
                color="var(--mantine-color-green-6)"
                fill="var(--mantine-color-green-1)"
              />
            </Marker>
          )}
          {dropoffCoords && (
            <Marker longitude={dropoffCoords.lng} latitude={dropoffCoords.lat}>
              <IconMapPin
                size={28}
                color="var(--mantine-color-red-6)"
                fill="var(--mantine-color-red-1)"
              />
            </Marker>
          )}
        </Map>
      </AppShell.Main>
    </AppShell>
  );
}
