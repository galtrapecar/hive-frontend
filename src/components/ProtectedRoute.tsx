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
  const [isSettingOrg, setIsSettingOrg] = useState(false);
  const [hasOrganizations, setHasOrganizations] = useState<boolean | null>(
    null,
  );
  const hasSetOrgRef = useRef(false);

  const isPending =
    sessionPending || (session && hasOrganizations === null) || isSettingOrg;

  useEffect(() => {
    const setActiveOrg = async () => {
      if (session && !hasSetOrgRef.current) {
        hasSetOrgRef.current = true;
        setIsSettingOrg(true);
        try {
          const orgs = await authClient.organization.list();
          if (orgs.data && orgs.data.length > 0) {
            setHasOrganizations(true);
            await authClient.organization.setActive({
              organizationId: orgs.data[0].id,
            });
          } else {
            setHasOrganizations(false);
          }
        } catch {
          setHasOrganizations(false);
        } finally {
          setIsSettingOrg(false);
        }
      }
    };
    setActiveOrg();
  }, [session]);

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
