import OpenAI from 'openai'
import type { ConveyancingCase } from '../domain/conveyancingCase'
import type { CaseTask } from '../domain/task'
import type { CaseEvent } from '../domain/caseEvent'
import type { CaseConversation, ConversationMessage } from '../domain/conversation'
import type { CaseExplainerAgent } from '../application/ports/CaseExplainerAgent'

const SYSTEM_PROMPT = `You are a warm, empathetic assistant helping a home buyer understand their conveyancing case.

Your job is to explain the current state of the case in plain, simple English — no legal jargon. Be honest, clear, and emotionally aware. The buyer may be stressed or confused, so keep things reassuring without downplaying real issues.

Respond with a JSON array of 3 to 4 message objects. Each object must have:
- "id": a string like "msg-1", "msg-2", etc.
- "title": a short, conversational question or heading (e.g. "Where are things at?")
- "body": 2–3 sentences explaining that aspect in plain language, with emotional warmth

Only return valid JSON — no markdown, no extra text.`

function selectRelevantEvents(events: CaseEvent[]): CaseEvent[] {
  const milestones = events.filter((e) => e.type === 'milestone.reached')
  const nonMilestones = events.filter((e) => e.type !== 'milestone.reached')
  const recentNonMilestones = nonMilestones.slice(-10)

  const seen = new Set<string>()
  const merged: CaseEvent[] = []
  for (const event of [...milestones, ...recentNonMilestones]) {
    if (!seen.has(event.id)) {
      seen.add(event.id)
      merged.push(event)
    }
  }

  return merged.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

function buildCaseContext(
  conveyancingCase: ConveyancingCase,
  tasks: CaseTask[],
  events: CaseEvent[]
): string {
  const blockedTasks = tasks.filter((t) => t.status === 'blocked')
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  const relevantEvents = selectRelevantEvents(events)
  const eventsSection =
    relevantEvents.length > 0
      ? relevantEvents
          .map((e) => {
            const date = e.timestamp.slice(0, 10)
            return `  [${date}] (${e.actor}) ${e.description}`
          })
          .join('\n')
      : '  No recent activity recorded.'

  return `
Case reference: ${conveyancingCase.reference}
Type: ${conveyancingCase.type}
Status: ${conveyancingCase.status}
Current stage: ${conveyancingCase.current_stage}
Priority: ${conveyancingCase.priority}

Property: ${conveyancingCase.property.address.line_1}, ${conveyancingCase.property.address.city}, ${conveyancingCase.property.address.postcode}
Purchase price: £${conveyancingCase.financials.purchase_price.toLocaleString('en-GB')}
Target completion: ${conveyancingCase.target_completion_date}
Estimated exchange: ${conveyancingCase.estimated_exchange_date}

Buyer: ${conveyancingCase.parties.buyer.name}
Conveyancer: ${conveyancingCase.parties.buyer_conveyancer.handler}

Tasks summary:
- Completed (${completedTasks.length}): ${completedTasks.map((t) => t.title).join(', ') || 'none'}
- In progress (${inProgressTasks.length}): ${inProgressTasks.map((t) => t.title).join(', ') || 'none'}
- Blocked (${blockedTasks.length}): ${blockedTasks.map((t) => `${t.title} — ${t.blocked_reason ?? 'reason unknown'}`).join(', ') || 'none'}

Recent case activity:
${eventsSection}
`.trim()
}

export class OpenAICaseExplainerAgent implements CaseExplainerAgent {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  }

  async explainCase(
    conveyancingCase: ConveyancingCase,
    tasks: CaseTask[],
    events: CaseEvent[]
  ): Promise<CaseConversation> {
    const context = buildCaseContext(conveyancingCase, tasks, events)

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: context },
      ],
      temperature: 0.7,
    })

    const raw = response.choices[0]?.message?.content ?? '[]'
    const parsed = JSON.parse(raw) as Array<{ id: string; title: string; body: string }>

    const messages: ConversationMessage[] = parsed.map((item) => ({
      id: item.id,
      role: 'ai',
      title: item.title,
      body: item.body,
    }))

    return {
      caseId: conveyancingCase.id,
      messages,
      generatedAt: new Date().toISOString(),
    }
  }
}
