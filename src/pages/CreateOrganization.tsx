import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Button,
  Box,
  Stack,
  Title,
  Text,
  Center,
  Loader,
  Grid,
  ThemeIcon,
  Group,
} from "@mantine/core";
import {
  IconBuilding,
  IconUsers,
  IconShieldCheck,
  IconRocket,
  IconLogout,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { organization, signOut, useSession } from "../lib/auth-client";

interface FormValues {
  name: string;
  slug: string;
}

const features = [
  {
    icon: IconUsers,
    title: "Team Collaboration",
    description: "Invite team members and work together seamlessly",
  },
  {
    icon: IconShieldCheck,
    title: "Role-Based Access",
    description: "Control permissions with customizable roles",
  },
  {
    icon: IconRocket,
    title: "Get Started Fast",
    description: "Set up in seconds and start being productive",
  },
];

export function CreateOrganization() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      slug: "",
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Organization name is required",
      slug: (value) => {
        if (value.trim().length === 0) return "Slug is required";
        if (!/^[a-z0-9-]+$/.test(value))
          return "Slug can only contain lowercase letters, numbers, and hyphens";
        return null;
      },
    },
  });

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    form.setFieldValue("slug", slug);
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await organization.create({
        name: values.name,
        slug: values.slug,
      });

      if (error) {
        setError(error.message || "Failed to create organization");
        return;
      }

      navigate("/");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Box mih="100vh" bg="gray.0">
      <Grid gutter={0} mih="100vh">
        <Grid.Col span={{ base: 12, md: 5 }} bg="white" p="xl" mih="100vh">
          <Stack h="100%" justify="center" maw={400} mx="auto" py={40}>
            <Box>
              <Group gap="xs" mb="xs">
                <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                  <IconBuilding size={20} />
                </ThemeIcon>
                <Title order={2}>Create Your Organization</Title>
              </Group>

              <Text c="dimmed" size="sm" mb="xl">
                Welcome, {session?.user?.name || "there"}! Let's set up your
                workspace.
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Organization Name"
                    placeholder="Hive Inc."
                    size="md"
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    onChange={(e) => {
                      form.getInputProps("name").onChange(e);
                      handleNameChange(e.target.value);
                    }}
                  />
                  <TextInput
                    label="URL Slug"
                    placeholder="hive-inc"
                    description="This will be used in your organization's URL"
                    size="md"
                    leftSection={
                      <Text size="sm" c="dimmed">
                        hive.app/
                      </Text>
                    }
                    leftSectionWidth={70}
                    key={form.key("slug")}
                    {...form.getInputProps("slug")}
                  />
                  {error && (
                    <Text c="red" size="sm">
                      {error}
                    </Text>
                  )}
                  <Button type="submit" size="md" mt="md" loading={loading}>
                    Create Organization
                  </Button>
                </Stack>
              </form>

              <Button
                variant="subtle"
                color="gray"
                size="sm"
                mt="md"
                leftSection={<IconLogout size={16} />}
                onClick={() => signOut()}
              >
                Log out
              </Button>
            </Box>
          </Stack>
        </Grid.Col>

        <Grid.Col
          span={{ base: 12, md: 7 }}
          visibleFrom="md"
          mih="100vh"
          style={{
            background: "linear-gradient(135deg, #FFB71A 0%, #FF8C00 100%)",
          }}
        >
          <Stack mih="100vh" justify="center" align="center" p="xl">
            <Box maw={500}>
              <Title order={1} c="white" mb="xl">
                Everything your team needs to succeed
              </Title>

              <Stack gap="lg">
                {features.map((feature) => (
                  <Group key={feature.title} align="flex-start" gap="md">
                    <ThemeIcon
                      size={44}
                      radius="md"
                      variant="white"
                      color="orange"
                    >
                      <feature.icon size={24} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} c="white" size="lg">
                        {feature.title}
                      </Text>
                      <Text c="white" opacity={0.9} size="sm">
                        {feature.description}
                      </Text>
                    </Box>
                  </Group>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
