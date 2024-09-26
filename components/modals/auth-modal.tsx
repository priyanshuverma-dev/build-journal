"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Icons } from "../icons";

const AuthModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const r = usePathname();

  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");

  const handleOnOpenChange = (open: boolean) => {
    router.push("/");
  };

  async function onLogin() {
    try {
      setIsLoading(true);
      const res = await signIn("github", {
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      if (res?.ok) {
        if (callback) {
          router.push(callback);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={r === "/auth"}
      onOpenChange={handleOnOpenChange}
      isDismissable
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>Authenticate Now</ModalHeader>
        <ModalBody>
          <div className="flex justify-center items-center p-4 flex-col">
            <div className="flex">
              <p>
                By authenticating with Github, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <Button
              type="button"
              onClick={onLogin}
              disabled={isLoading}
              className="mt-4 w-full sm:w-auto"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              Authenticate with Github
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
