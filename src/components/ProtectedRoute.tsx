import { Navigate, useLocation } from "react-router-dom";
import { useSession, authClient } from "../lib/auth-client";
import { Center, Loader } from "@mantine/core";
import { useEffect, useState, useRef } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrganizations, setHasOrganizations] = useState<boolean | null>(
    null,
  );
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const hasInitRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      if (hasInitRef.current) return;
      hasInitRef.current = true;

      try {
        // Set active org if not already set
        if (!session.session.activeOrganizationId) {
          const orgs = await authClient.organization.list();
          if (orgs.data && orgs.data.length > 0) {
            await authClient.organization.setActive({
              organizationId: orgs.data[0].id,
            });
            setHasOrganizations(true);
          } else {
            setHasOrganizations(false);
            setIsLoading(false);
            return;
          }
        } else {
          setHasOrganizations(true);
        }

        // Fetch member role directly
        const member = await authClient.organization.getActiveMember();
        if (member.data) {
          setMemberRole(member.data.role);
        }
      } catch {
        setHasOrganizations(false);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [session]);

  if (sessionPending || (session && isLoading)) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!session) {
    const redirectParam =
      location.pathname !== "/"
        ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
        : "";
    return <Navigate to={`/login${redirectParam}`} replace />;
  }

  if (memberRole === "driver") {
    return <Navigate to="/forbidden" replace />;
  }

  if (requireOrganization && !hasOrganizations) {
    return <Navigate to="/create-organization" replace />;
  }

  if (
    !requireOrganization &&
    hasOrganizations &&
    location.pathname === "/create-organization"
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
