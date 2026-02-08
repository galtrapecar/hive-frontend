import { Navigate, useLocation } from "react-router-dom";
import { useSession, useListOrganizations } from "../lib/auth-client";
import { Center, Loader } from "@mantine/core";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOrganization?: boolean;
}

export default function ProtectedRoute({
  children,
  requireOrganization = true,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: orgsPending } =
    useListOrganizations();

  const isPending = sessionPending || (session && orgsPending);

  if (isPending) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const hasOrganizations = organizations && organizations.length > 0;

  if (requireOrganization && !hasOrganizations) {
    return <Navigate to="/create-organization" replace />;
  }

  if (!requireOrganization && hasOrganizations && location.pathname === "/create-organization") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
