import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Container,
  Stack,
  Text,
  Anchor,
  Group,
  Center,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn, signUp, useSession } from "../lib/auth-client";
import Logo from "../assets/logo-dark.svg?react";

interface FormValues {
  email: string;
  password: string;
  name: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      name: (value) => {
        if (!isSignUp) return null;
        return value.trim().length > 0 ? null : "Name is required";
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
        });
        if (error) {
          setError(error.message || "Sign up failed");
          return;
        }
      } else {
        const { error } = await signIn.email({
          email: values.email,
          password: values.password,
        });
        if (error) {
          setError(error.message || "Sign in failed");
          return;
        }
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
    <Container size={420} my={40}>
      <Group align="center">
        <Logo height={64} />
      </Group>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {isSignUp && (
              <TextInput
                label="Name"
                placeholder="Your name"
                key={form.key("name")}
                {...form.getInputProps("name")}
              />
            )}
            <TextInput
              label="Email"
              placeholder="you@example.com"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <Anchor
          size="sm"
          component="button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </Anchor>
      </Text>
    </Container>
  );
}
