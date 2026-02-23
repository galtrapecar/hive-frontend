import { Navigate, useLocation } from "react-router-dom";
import {
  useSession,
  useListOrganizations,
  authClient,
} from "../lib/auth-client";
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
  const { data: organizations, isPending: orgsPending } =
    useListOrganizations();
  const [isSettingOrg, setIsSettingOrg] = useState(false);
  const hasSetOrgRef = useRef(false);

  const isPending = sessionPending || (session && orgsPending) || isSettingOrg;

  useEffect(() => {
    const setActiveOrg = async () => {
      if (session && !hasSetOrgRef.current) {
        hasSetOrgRef.current = true;
        setIsSettingOrg(true);
        try {
          const orgs = await authClient.organization.list();
          if (orgs.data && orgs.data.length > 0) {
            await authClient.organization.setActive({
              organizationId: orgs.data[0].id,
            });
          }
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

  const hasOrganizations = organizations && organizations.length > 0;

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
