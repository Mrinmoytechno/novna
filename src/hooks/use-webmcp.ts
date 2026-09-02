"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  registerNOVNAWebMCP,
} from "@/webmcp/register-tools";

import type {
  WebMCPHandlers,
} from "@/webmcp/tools";

export function useWebMCP(
  handlers: WebMCPHandlers,
) {
  const handlersRef =
    useRef<WebMCPHandlers>(
      handlers,
    );

  handlersRef.current =
    handlers;

  const [
    supported,
    setSupported,
  ] = useState(false);

  const [
    registeredTools,
    setRegisteredTools,
  ] = useState<string[]>(
    [],
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let disposed =
      false;

    const stableHandlers:
      WebMCPHandlers = {
      getState:
        () =>
          handlersRef.current
            .getState(),

      considerProduct:
        (
          productId,
        ) =>
          handlersRef.current
            .considerProduct(
              productId,
            ),

      setComparedProducts:
        (
          productIds,
        ) =>
          handlersRef.current
            .setComparedProducts(
              productIds,
            ),

      addInsight:
        (
          insight,
        ) =>
          handlersRef.current
            .addInsight(
              insight,
            ),

      updateGoal:
        (
          updates,
        ) =>
          handlersRef.current
            .updateGoal(
              updates,
            ),
    };

    async function register() {
      try {
        const result =
          await registerNOVNAWebMCP(
            stableHandlers,
          );

        if (
          disposed
        ) {
          return;
        }

        setSupported(
          result.supported,
        );

        if (
          result.supported
        ) {
          setRegisteredTools(
            result.registered.map(
              (
                tool,
              ) =>
                tool.name,
            ),
          );
        }
      } catch (
        registrationError
      ) {
        if (
          disposed
        ) {
          return;
        }

        setError(
          registrationError instanceof
            Error
            ? registrationError.message
            : "WebMCP registration failed.",
        );
      }
    }

    void register();

    return () => {
      disposed =
        true;
    };
  }, []);

  return {
    supported,

    registeredTools,

    error,
  };
}