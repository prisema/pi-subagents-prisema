import { beforeEach, describe, expect, it } from "vitest";
import type { AgentManager } from "../src/agent-manager.js";
import { registerAgents } from "../src/agent-types.js";
import type { AgentRecord } from "../src/types.js";
import { AgentWidget, type Theme, type UICtx } from "../src/ui/agent-widget.js";

const theme: Theme = {
  fg: (_color, text) => text,
  bold: (text) => text,
};

const tui = { terminal: { columns: 200 }, requestRender: () => {} };

function makeWidget(records: AgentRecord[]) {
  const manager = { listAgents: () => records } as unknown as AgentManager;
  return new AgentWidget(manager, new Map());
}

function record(overrides: Partial<AgentRecord>): AgentRecord {
  return {
    id: "agent-1",
    type: "Explore",
    description: "Find files",
    status: "running",
    toolUses: 0,
    startedAt: Date.now() - 1000,
    ...overrides,
  };
}

describe("AgentWidget", () => {
  beforeEach(() => {
    registerAgents(new Map());
  });

  it("renders running agents", () => {
    const widget = makeWidget([record({ status: "running" })]);

    const lines = (widget as any).renderWidget(tui, theme) as string[];
    const text = lines.join("\n");

    expect(text).toContain("Agents");
    expect(text).toContain("Explore");
    expect(text).toContain("Find files");
  });

  it("does not render finished agents", () => {
    const widget = makeWidget([
      record({ status: "steered", completedAt: Date.now(), statusReason: "turn limit" }),
    ]);

    const lines = (widget as any).renderWidget(tui, theme) as string[];

    expect(lines).toEqual([]);
  });

  it("clears the widget instead of lingering a finished line", () => {
    const records = [record({ status: "running" })];
    const widget = makeWidget(records);
    const setWidgetCalls: Array<{ key: string; content: unknown }> = [];
    const uiCtx: UICtx = {
      setStatus: () => {},
      setWidget: (key, content) => setWidgetCalls.push({ key, content }),
    };

    widget.setUICtx(uiCtx);
    widget.update();

    records[0] = record({ status: "completed", completedAt: Date.now() });
    widget.markFinished("agent-1");
    widget.update();

    expect(setWidgetCalls.at(-1)).toEqual({ key: "agents", content: undefined });
  });
});
