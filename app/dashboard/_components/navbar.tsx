"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Skeleton,
} from "@nextui-org/react";
import { Variable } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardNav() {
  const { data: user, status } = useSession();
  return (
    <Navbar>
      <NavbarBrand as={Link} href={"/dashboard"} className="flex items-end">
        <Variable className="w-8 h-8" />
        <p className="font-bold text-inherit text-2xl">Build Journal</p>
      </NavbarBrand>

      {status == "loading" && (
        <div>
          <Skeleton className="flex rounded-full w-10 h-10" />
        </div>
      )}
      {status == "authenticated" && (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="default"
                name={user?.user?.name ?? "User"}
                size="sm"
                src={user?.user?.image ?? ""}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>

              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut()}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
    </Navbar>
  );
}
