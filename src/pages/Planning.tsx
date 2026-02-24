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
  IconMoneybag,
  IconPackage,
  IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Logo from "../assets/logo-dark.svg?react";
import {
  useOrderControllerFindOneQuery,
  useOrderControllerUpdateMutation,
} from "../redux/generatedApi";
import { EditableLocation } from "../components/EditableLocation";
import { PulsingMarker } from "../components/PulsingMarker";
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
  const {
    data: order,
    isLoading,
    refetch,
  } = useOrderControllerFindOneQuery(
    {
      id: Number(orderId),
      organizationId: activeOrg?.id || "",
    },
    {
      skip: !activeOrg?.id || !orderId,
    },
  );
  const [updateOrder] = useOrderControllerUpdateMutation();
  const [editingPickup, setEditingPickup] = useState(false);
  const [editingDropoff, setEditingDropoff] = useState(false);
  const [draggedPickup, setDraggedPickup] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [draggedDropoff, setDraggedDropoff] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Clear dragged coords once refetch brings updated order data
  useEffect(() => {
    setDraggedPickup(null);
  }, [order?.pickupLat, order?.pickupLng]);

  useEffect(() => {
    setDraggedDropoff(null);
  }, [order?.dropoffLat, order?.dropoffLng]);

  const pickupCoords =
    order?.pickupLat != null && order?.pickupLng != null
      ? { lat: Number(order.pickupLat), lng: Number(order.pickupLng) }
      : null;

  const dropoffCoords =
    order?.dropoffLat != null && order?.dropoffLng != null
      ? { lat: Number(order.dropoffLat), lng: Number(order.dropoffLng) }
      : null;

  useEffect(() => {
    zoomMap();
  }, [
    pickupCoords?.lat,
    pickupCoords?.lng,
    dropoffCoords?.lat,
    dropoffCoords?.lng,
    mapLoaded,
  ]);

  const zoomMap = () => {
    const map = mapRef.current;
    if (!map) {
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
  };

  return (
    <AppShell navbar={{ width: 380, breakpoint: "sm" }} padding={0}>
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
                    <Accordion.Panel
                      px={0}
                      styles={{
                        content: {
                          padding: 0,
                        },
                      }}
                    >
                      <Stack gap="md">
                        <EditableLocation
                          label="Pickup"
                          color="green"
                          name={order.pickupPoint}
                          time={order.pickupTime}
                          lat={pickupCoords?.lat ?? null}
                          lng={pickupCoords?.lng ?? null}
                          draggedCoords={draggedPickup}
                          onEditingChange={(editing) => {
                            setEditingPickup(editing);
                            if (!editing) {
                              setDraggedPickup(null);
                              zoomMap();
                            }
                            if (
                              editing &&
                              pickupCoords?.lat &&
                              pickupCoords?.lng
                            ) {
                              mapRef.current?.flyTo({
                                center: [pickupCoords.lng, pickupCoords.lat],
                                zoom: 13,
                                duration: 1000,
                              });
                            }
                          }}
                          onConfirm={async (name, lat, lng) => {
                            setDraggedPickup({ lat, lng });
                            await updateOrder({
                              id: Number(orderId),
                              organizationId: activeOrg!.id,
                              updateOrderDto: {
                                pickupPoint: name,
                                pickupLat: lat,
                                pickupLng: lng,
                              },
                            }).unwrap();
                            refetch();
                          }}
                        />

                        <EditableLocation
                          label="Dropoff"
                          color="red"
                          name={order.dropoffPoint}
                          time={order.dropoffTime}
                          lat={dropoffCoords?.lat ?? null}
                          lng={dropoffCoords?.lng ?? null}
                          draggedCoords={draggedDropoff}
                          onEditingChange={(editing) => {
                            setEditingDropoff(editing);
                            if (!editing) {
                              setDraggedDropoff(null);
                              zoomMap();
                            }
                            if (
                              editing &&
                              dropoffCoords?.lat &&
                              dropoffCoords?.lng
                            ) {
                              mapRef.current?.flyTo({
                                center: [dropoffCoords.lng, dropoffCoords.lat],
                                zoom: 13,
                                duration: 1000,
                              });
                            }
                          }}
                          onConfirm={async (name, lat, lng) => {
                            setDraggedDropoff({ lat, lng });
                            await updateOrder({
                              id: Number(orderId),
                              organizationId: activeOrg!.id,
                              updateOrderDto: {
                                dropoffPoint: name,
                                dropoffLat: lat,
                                dropoffLng: lng,
                              },
                            }).unwrap();
                            refetch();
                          }}
                        />

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
                          <Group gap="xs">
                            <IconMoneybag
                              size={16}
                              color="var(--mantine-color-dimmed)"
                            />
                            <Text size="sm" c="dimmed">
                              Price
                            </Text>
                          </Group>

                          <Text size="sm" fw={500}>
                            {order.price.toFixed(2)} €
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
            <Marker
              longitude={draggedPickup?.lng ?? pickupCoords.lng}
              latitude={draggedPickup?.lat ?? pickupCoords.lat}
              draggable={editingPickup}
              onDragEnd={(e) => {
                setDraggedPickup({
                  lat: e.lngLat.lat,
                  lng: e.lngLat.lng,
                });
              }}
            >
              <PulsingMarker
                color="var(--mantine-color-green-6)"
                fill="var(--mantine-color-green-1)"
                pulsing={editingPickup}
              />
            </Marker>
          )}
          {dropoffCoords && (
            <Marker
              longitude={draggedDropoff?.lng ?? dropoffCoords.lng}
              latitude={draggedDropoff?.lat ?? dropoffCoords.lat}
              draggable={editingDropoff}
              onDragEnd={(e) => {
                setDraggedDropoff({
                  lat: e.lngLat.lat,
                  lng: e.lngLat.lng,
                });
              }}
            >
              <PulsingMarker
                color="var(--mantine-color-red-6)"
                fill="var(--mantine-color-red-1)"
                pulsing={editingDropoff}
              />
            </Marker>
          )}
        </Map>
      </AppShell.Main>
    </AppShell>
  );
}
