"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data, status } = useSession();
  return (
    <div>
      {status}: {data?.user?.email}
    </div>
  );
}
