import type { TScenarioId } from "@/constants/projects";

export type AppKey =
  | "brevo"
  | "make"
  | "router"
  | "python"
  | "langchain"
  | "supabase"
  | "pandadoc"
  | "planhat"
  | "qobra"
  | "gong"
  | "chilipiper"
  | "slack"
  | "dust"
  | "webhook"
  | "cron"
  | "platform"
  | "user";

export type NodeKind = "trigger" | "router" | "action" | "store" | "ai";

export interface ScenarioNode {
  id: string;
  app: AppKey;
  kind: NodeKind;
  /** Module name shown under the node. */
  label: string;
  /** What the module does, Make-style ("Watch deals", "Upsert row"). */
  action: string;
  /** Canvas units. The full canvas is 1000 × 560. */
  x: number;
  y: number;
  /** Inspector copy for the hover card. */
  note?: string;
}

export interface ScenarioEdge {
  id: string;
  from: string;
  to: string;
  /** Route filter, rendered as a funnel pill at the midpoint. */
  filter?: string;
  /** Error-handler route — dashed, never fired by a normal run. */
  error?: boolean;
}

export interface Scenario {
  id: TScenarioId;
  name: string;
  schedule: string;
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
}

export type NodeStatus = "idle" | "active" | "done" | "blip";
