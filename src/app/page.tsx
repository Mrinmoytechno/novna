"use client";

import {
  useMemo,
} from "react";

import {
  Sparkles,
} from "lucide-react";

import {
  ExplorePanel,
} from "@/components/explore-panel";

import {
  DecisionSpace,
} from "@/components/decision-space";

import {
  ComparisonDock,
} from "@/components/comparison-dock";

import {
  DecisionResult,
} from "@/components/decision-result";

import {
  DecisionBrief,
} from "@/components/decision-brief";

import {
  DecisionSetup,
} from "@/components/decision-setup";

import {
  AgentActivity,
} from "@/components/agent-activity";

import {
  AgentInsight,
} from "@/components/agent-insight";

import {
  WebMCPStatus,
} from "@/components/webmcp-status";

import {
  laptops,
} from "@/data/laptops";

import {
  evaluateDecision,
} from "@/lib/decision-engine";

import {
  useDecisionState,
} from "@/hooks/use-decision-state";

import {
  useWebMCP,
} from "@/hooks/use-webmcp";

import {
  useAgentEvents,
} from "@/hooks/use-agent-events";

import type {
  WebMCPHandlers,
} from "@/webmcp/tools";

export default function Home() {
  const {
    state,

    considerProduct,
    rejectProduct,

    toggleCompare,
    setComparedProducts,

    updateGoal,
    addInsight,

    clearComparison,
  } = useDecisionState();

  const {
    events,
  } = useAgentEvents();

  const comparedProducts =
    useMemo(
      () =>
        laptops.filter(
          (product) =>
            state.comparedProductIds.includes(
              product.id,
            ),
        ),
      [
        state.comparedProductIds,
      ],
    );

  const decisionProducts =
    useMemo(
      () =>
        state.consideredProductIds
          .length > 0
          ? laptops.filter(
              (product) =>
                state.consideredProductIds.includes(
                  product.id,
                ),
            )
          : laptops,
      [
        state.consideredProductIds,
      ],
    );

  const decision =
    useMemo(
      () =>
        evaluateDecision(
          state,
          decisionProducts,
        ),
      [
        state,
        decisionProducts,
      ],
    );

  const webMCPHandlers =
    useMemo<WebMCPHandlers>(
      () => ({
        getState:
          () => state,

        considerProduct:
          (productId) =>
            considerProduct(
              productId,
            ),

        setComparedProducts:
          (productIds) =>
            setComparedProducts(
              productIds,
            ),

        addInsight:
          (insight) =>
            addInsight(
              insight,
            ),
      }),
      [
        state,
        considerProduct,
        setComparedProducts,
        addInsight,
      ],
    );

  const webMCP =
    useWebMCP(
      webMCPHandlers,
    );

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Sparkles
                size={17}
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                NOVNA
              </p>

              <p className="hidden text-[10px] uppercase tracking-[0.16em] text-neutral-400 sm:block">
                The decision before the purchase
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
              Live decision
            </p>

            <p className="text-xs font-medium">
              Human + agent
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Laptop decision
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Don&apos;t just find a laptop.
            <br />

            <span className="text-neutral-400">
              Find the right decision.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-500">
            NOVNA helps you explore products
            while an agent can investigate
            the same live decision with you.
          </p>
        </div>

        <DecisionSetup
          goal={state.goal}
          onUpdate={updateGoal}
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <ExplorePanel
              consideredIds={
                state.consideredProductIds
              }
              rejectedIds={
                state.rejectedProductIds
              }
              comparedIds={
                state.comparedProductIds
              }
              onConsider={
                considerProduct
              }
              onReject={
                rejectProduct
              }
              onCompare={
                toggleCompare
              }
            />
          </div>

          <aside className="space-y-4 xl:pt-2">
            <WebMCPStatus
              supported={
                webMCP.supported
              }
              registeredTools={
                webMCP.registeredTools
              }
              error={
                webMCP.error
              }
            />

            <AgentActivity
              events={
                events
              }
              connected={
                webMCP.supported
              }
            />

            <DecisionResult
              result={
                decision
              }
            />

            <DecisionBrief
              state={
                state
              }
              decision={
                decision
              }
            />

            <AgentInsight
              insights={
                state.insights
              }
            />

            <DecisionSpace
              state={
                state
              }
              products={
                laptops
              }
            />
          </aside>
        </div>
      </div>

      <ComparisonDock
        products={
          comparedProducts
        }
        onRemove={
          toggleCompare
        }
        onClear={
          clearComparison
        }
      />
    </main>
  );
}