# NOVNA

### The decision before the purchase.

NOVNA is a decision-first shopping workspace where humans and AI agents can work on the same purchase decision together.

Instead of asking an AI to simply recommend a product, NOVNA gives the agent access to the user's **live decision state** — their goal, budget, shortlist, comparisons, preferences, insights, and current decision.

**Live:** https://novna.vercel.app  
**Repository:** https://github.com/Mrinmoytechno/novna

> Built for the OpenAI WebMCP Challenge 2026.

---

## The Problem

Shopping assistants are usually built around a simple pattern:

**User asks → AI answers → User decides.**

That works for simple questions, but real purchasing decisions are rarely just information problems.

A person may:

- have a specific budget
- already be considering several products
- care about portability more than raw performance
- be tempted by specifications they do not actually need
- change their priorities during research
- need to decide whether to buy now, spend more, buy cheaper, wait, or not buy at all

The difficult part is not finding another product.

**The difficult part is making the decision.**

NOVNA is built around that decision itself.

---

## Why WebMCP Is a Strong Fit

NOVNA is designed around a shared decision state, which makes it a natural fit for WebMCP.

The human interacts with the normal web interface. An external AI agent can use NOVNA's WebMCP tools to inspect and change the same decision workspace.

This means the agent does not need to receive a screenshot, scrape the page, or work from a separate copy of the user's context.

It can directly access structured decision information such as:

- the user's current goal and budget
- products being considered
- product details
- the current shortlist
- comparisons
- decision insights
- the current decision outcome

The agent can also take meaningful actions through tools, including:

- updating the user's goal
- considering or rejecting products
- comparing products
- finding value alternatives
- evaluating whether to wait or buy
- surfacing a product
- challenging the current decision
- creating decision insights

This is where WebMCP changes the experience.

**NOVNA is not an AI chatbot with a product catalog attached.**

The decision workspace itself becomes a tool-enabled environment that both the human and the agent can work on.

---

## The Human + Agent Experience

NOVNA keeps the human in control while giving an AI agent meaningful ways to participate.

A typical interaction can look like this:

1. The human defines what they actually need and sets a budget.
2. NOVNA builds a decision state around that goal.
3. The human explores products and creates a shortlist.
4. An external AI agent inspects the same live decision state through WebMCP.
5. The agent can identify gaps, challenge assumptions, compare options, or surface a better-fit alternative.
6. The human sees those actions and insights inside NOVNA.
7. The human makes the final decision.

The important part is that the agent is not producing an isolated answer.

It is **participating in the decision already happening on the page.**

### A concrete example

Suppose a user is considering an expensive laptop because it has significantly higher specifications.

Instead of simply agreeing with the user's choice, the agent can inspect:

- the user's actual use cases
- their budget
- the products already being considered
- the capabilities of those products

It can then challenge the decision and surface a cheaper product if the additional capability does not meaningfully improve the user's stated use case.

The result is not:

> "Here are some laptops you might like."

It is:

> **"Given what you told me you need, do you actually need to spend this much?"**

That is the decision NOVNA is designed to help solve.

---

## What Becomes Possible With WebMCP

Without WebMCP, a shopping agent would typically need to work from information the user manually provides.

The user might have to:

- copy product specifications into a chat
- explain their shortlist
- describe their budget again
- paste comparisons
- tell the agent what changed
- manually apply the agent's recommendations back to the shopping experience

The context becomes fragmented.

With NOVNA + WebMCP, the agent can work directly against the live decision workspace.

### Before

```text
Shopping page
     ↓
Human copies information
     ↓
AI receives partial context
     ↓
AI produces advice
     ↓
Human manually applies advice
```
### With NOVNA

```text
                 ┌──────────────────┐
                 │   NOVNA Decision  │
                 │      State       │
                 └────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              ↓                       ↓
        Human interface          WebMCP tools
              │                       │
              │                       ↓
              │                External AI agent
              │                       │
              └───────────┬───────────┘
                          ↓
                  Shared decision
                     workspace
```
The human and agent therefore operate on the same underlying decision state.

The agent can inspect the state, reason about it, and make supported changes through WebMCP tools.

The human can immediately see those changes and remain the final decision-maker.

This makes the interaction collaborative rather than conversational-only.

---

## The Decision Is the Product

NOVNA does not treat the product catalog as the center of the experience.

The center is the **decision**.

A product can be technically better while still being the wrong purchase for a particular person.

NOVNA therefore keeps track of the reasoning around a purchase:

- What the user is trying to accomplish
- What they are willing to spend
- Which products they are considering
- Which products they rejected
- Which products are being compared
- What preferences have emerged
- What insights have been generated
- What the current decision outcome is

This allows NOVNA to reason about **fit**, rather than simply ranking products by specifications.

### Decision outcomes

NOVNA can arrive at different outcomes depending on the user's situation:

| Outcome | Meaning |
|---|---|
| `BUY_NOW` | The current choice is a strong fit and the user is ready to buy. |
| `BUY_CHEAPER` | A less expensive option can satisfy the user's needs. |
| `SPEND_MORE` | Additional budget may be justified by the user's requirements. |
| `WAIT` | Buying immediately may not be the best decision. |
| `DONT_BUY` | The purchase itself may not be justified. |
| `KEEP_CURRENT` | The user's existing product may already be sufficient. |
| `ALTERNATIVE` | A different product or approach may fit better. |

The goal is not to maximize the price of the recommendation.

**The goal is to reach the right decision for the person.**

---

## Decision-First Architecture

NOVNA is built around a single source of truth: the user's `DecisionState`.

The interface, decision engine, and WebMCP layer operate around this state.

```text
User
 │
 ▼
NOVNA Interface
 │
 ▼
Decision State
 │
 ├── Goal
 ├── Budget
 ├── Shortlist
 ├── Comparisons
 ├── Preferences
 ├── Insights
 └── Outcome
       │
       ├──────────────► Decision Engine
       │
       └──────────────► WebMCP Tool Layer
                              │
                              ▼
                         External Agent
```
This architecture is important because WebMCP is not implemented as a separate demo surface.

The tools connect the external agent to the same decision model used by the application.

When a supported tool changes the decision state, the interface can reflect that change without requiring the human to manually copy information between systems.

### Core layers

**Interface**

Provides the human-facing decision workspace, product exploration, comparisons, insights, and decision timeline.

**Decision State**

Stores the current state of the purchase decision.

**Decision Engine**

Uses explicit product and user requirements to evaluate fit and produce explainable outcomes.

**WebMCP Layer**

Exposes structured tools that allow an external AI agent to inspect and interact with the decision state.

**Product Data**

Uses structured laptop data with manufacturer-source references so product claims can be traced back to their source.

---

## Decision Engine

NOVNA uses a transparent decision engine rather than a single opaque recommendation score.

The engine evaluates the relationship between the user's requirements and the capabilities of each product.

Relevant factors include:

- Budget fit
- Memory requirements
- Storage requirements
- Portability
- Display requirements
- Required use cases
- User priorities

The engine produces a fit assessment such as:

- `STRONG`
- `GOOD`
- `MIXED`
- `WEAK`
- `UNKNOWN`

It can then support outcomes such as buying the current option, buying a cheaper option, spending more when justified, choosing an alternative, waiting, or deciding not to buy.

This makes the reasoning easier to inspect and gives the WebMCP agent structured information to work with.

NOVNA intentionally avoids treating "more specifications" or "higher price" as automatically better.

A recommendation should be justified by the user's actual requirements.

---

## Decision Timeline

NOVNA records meaningful changes to the decision as a timeline.

This gives the human a visible history of how the decision evolved instead of treating every interaction as an isolated recommendation.

Timeline events can represent:

- Goal updates
- Products considered
- Products rejected
- Comparisons updated
- Insights created
- Decision challenges
- Products surfaced by the agent
- Changes to the final decision outcome

Each event records its type, timestamp, relevant products, and source where applicable.

The source can distinguish between:

- `HUMAN`
- `AGENT`
- `SYSTEM`

This creates an important feedback loop between the human and the external agent.

The human can see not only **what the current decision is**, but also **how the decision got there**.

That makes agent participation visible, understandable, and auditable rather than hidden inside a chat transcript.

---

## WebMCP Implementation

NOVNA registers WebMCP tools directly from the application and connects them to the live decision state.

The tool layer includes:

| Tool | Purpose |
|---|---|
| `get_decision_state` | Inspect the complete current decision state |
| `get_user_goal` | Inspect the user's current goal |
| `get_product_details` | Retrieve structured details for a product |
| `get_shortlist` | Retrieve products currently being considered |
| `search_products` | Search the product catalog |
| `compare_products` | Compare selected products |
| `find_value_alternatives` | Find lower-cost or better-fit alternatives |
| `evaluate_wait_vs_buy` | Evaluate whether waiting may be preferable |
| `surface_product` | Surface a product into the human workspace |
| `challenge_decision` | Challenge the assumptions behind the current decision |
| `update_user_goal` | Update the user's decision goal through the agent |

The implementation uses the browser's WebMCP API and registers tools against `document.modelContext`.

Conceptually, the registration follows the WebMCP tool contract:

```ts
document.modelContext.registerTool({
  name: "search_products",
  description: "Search the product catalog",
  inputSchema: ...,
  execute: async (input) => {
    // Search NOVNA's structured product catalog
  }
});
```
In NOVNA, these tools are composed from the application's WebMCP tool layer and connected to the same handlers used by the decision workspace.

This means the external agent is interacting with real application capabilities rather than a simulated tool interface.

---

## Human Control

NOVNA is designed as a human-led decision workspace, not an autonomous purchasing system.

The external agent can inspect the decision, surface information, create insights, challenge assumptions, and make supported changes through WebMCP.

The human still controls the final decision.

This distinction is intentional.

An agent may identify that a cheaper laptop appears sufficient. It may challenge an expensive choice. It may surface an alternative the human had not considered.

But NOVNA does not turn that reasoning into an automatic purchase.

The human can review the agent's contribution, continue exploring, change their requirements, reject a suggestion, or make the final decision themselves.

The result is a collaborative model:

**Human provides intent → Agent provides reasoning and action → Human decides.**

---

## Product Data and Trust

NOVNA currently focuses on laptop purchasing decisions.

Product information is stored as structured data rather than being generated dynamically by the AI agent.

Where available, product records include:

- Manufacturer
- Product family and model
- Variant
- Processor
- Graphics
- Memory
- Storage
- Display
- Battery
- Weight
- Ports and connectivity
- Operating system
- Camera
- Use cases
- Pricing information
- Manufacturer source references
- Product images and their source pages

Manufacturer references are stored with the product records so important product claims can be traced back to the relevant source.

This separation is deliberate:

**Product facts come from structured product data.**

**Decision reasoning happens on top of that data.**

The agent therefore does not need to invent product specifications in order to participate in the decision.

---
## Tech Stack

NOVNA is built as a modern web application with a deliberately lightweight architecture.

- **Next.js** — application framework
- **React** — interactive interface
- **TypeScript** — typed application and tool layer
- **WebMCP** — browser-native agent interoperability
- **Vercel** — deployment
- **Structured product data** — laptop catalog and manufacturer references

The architecture keeps the decision model and WebMCP integration inside the application rather than introducing a separate backend solely for the challenge.

This keeps the core interaction simple:

**Web application → shared decision state → WebMCP tools → external agent.**

---

## Project Structure

The repository is organized around the decision model, human interface, and WebMCP integration.

```text
src/
├── app/
│   └── page.tsx
│
├── components/
│   ├── agent-activity.tsx
│   ├── agent-insight.tsx
│   ├── comparison-dock.tsx
│   ├── decision-brief.tsx
│   ├── decision-result.tsx
│   ├── decision-setup.tsx
│   ├── decision-space.tsx
│   ├── decision-timeline.tsx
│   ├── explore-panel.tsx
│   └── webmcp-status.tsx
│
├── hooks/
│   ├── use-agent-events.ts
│   ├── use-decision-state.ts
│   └── use-webmcp.ts
│
├── lib/
│   └── decision-engine.ts
│
├── types/
│   └── index.ts
│
└── webmcp/
    ├── agent-events.ts
    ├── goal-tool.ts
    ├── register-tools.ts
    ├── schemas.ts
    ├── tool-result.ts
    ├── tools.ts
    └── types.d.ts

public/
└── products/
    └── product assets
```

The important separation is intentional:

- `decision-engine.ts` contains decision logic.
- `use-decision-state.ts` manages the shared decision state.
- `webmcp/` contains the agent-facing integration.
- `components/` contains the human-facing workspace.
- `types/` defines the shared data model.

## Running Locally

### Requirements

- Node.js 20+
- npm

### Install

```bash
npm install
```
### Start the development server

```bash
npm run dev
```
Then open:
_http://localhost:3000_

### Production build

To verify the application can be built successfully:

```bash
npm run build
```
The application is designed to work as a normal web application even when WebMCP is unavailable.

When WebMCP is supported by the browser, NOVNA registers its agent-facing tools and exposes the decision workspace to an external AI agent.

---

## Testing WebMCP

NOVNA's WebMCP integration requires a browser environment with WebMCP support enabled.

### Chrome

Use a recent Chrome version with WebMCP testing enabled.

Open:

```text
chrome://flags/#enable-webmcp-testing
```
Enable the WebMCP testing flag and relaunch Chrome.

Then open the NOVNA application:

https://novna.vercel.app

The NOVNA interface includes a WebMCP status indicator showing whether the browser exposes the required WebMCP capability.

When WebMCP is available, the application registers its tools through `document.modelContext`.

### What to test

A WebMCP-capable external agent should be able to:

1. Inspect the current decision state.
2. Read the user's goal.
3. Search or inspect products.
4. Compare products.
5. Find value alternatives.
6. Challenge the current decision.
7. Surface products or insights into the workspace.
8. Update the user's goal through the `update_user_goal` tool.

The key test is not simply whether the tools register.

The key test is whether an external agent can **use those tools to participate in the same live decision that the human is viewing.**

---

## Design Principles

NOVNA follows a few principles that shape both the product and the WebMCP implementation.

### Decision over recommendation

The goal is not to produce another list of products.

The goal is to help reach a better purchase decision.

### Fit over specifications

A product with more specifications is not automatically the better choice.

Capabilities are evaluated against the user's actual requirements.

### Human control

The agent can participate in the decision, but the human remains in control of the final outcome.

### Shared state over copied context

The human and agent should work from the same live decision state rather than passing context back and forth manually.

### Explainability over opaque scoring

Decision outcomes should be understandable from the user's requirements and the product's capabilities.

### Trust over short-term conversion

NOVNA is designed to help users make an appropriate decision, even when that means recommending a cheaper option, waiting, or not purchasing.

---

## Built for the WebMCP Challenge

NOVNA was built specifically around the capabilities and judging criteria of the OpenAI WebMCP Challenge.

### WebMCP Leverage

WebMCP is used as a meaningful interaction layer between an external AI agent and NOVNA's live decision state.

The implementation exposes multiple decision-specific tools rather than a single demonstration tool.

### Execution

NOVNA is a complete decision workspace with:

- Human-facing product exploration
- Editable decision goals
- Structured product data
- Decision evaluation
- Product comparisons
- Agent insights
- Agent activity
- Decision timeline
- WebMCP tool registration
- Human + agent shared state

### Potential Impact

Purchasing decisions are often difficult because users must balance budget, requirements, specifications, alternatives, and uncertainty.

NOVNA explores a model where AI can participate directly in that decision process instead of simply generating another recommendation.

### Creativity & Ambition

The central idea is to make the **decision itself** the shared workspace between a human and an AI agent.

NOVNA's goal is not to make shopping more automated.

It is to make the reasoning behind a purchase more useful, transparent, and collaborative.

---

## Submission

**Live application**

https://novna.vercel.app

**Source repository**

https://github.com/Mrinmoytechno/novna

**Challenge**

OpenAI WebMCP Challenge 2026

The live application is the primary demonstration of NOVNA.

The repository contains the source code, product data, assets, WebMCP implementation, and instructions required to run the project locally.

The project is open source under the MIT License.

---

## Project Status

NOVNA is an active WebMCP Challenge submission build.

The core product, decision engine, shared decision state, WebMCP tool layer, agent activity surface, decision insights, comparison workflow, and decision timeline are implemented in the repository.

---

## License

This project is open source.

See [`LICENSE`](./LICENSE) for the applicable license.



