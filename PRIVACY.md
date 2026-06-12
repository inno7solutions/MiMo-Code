# Privacy

This document describes every situation in which MiMoCode sends data off your
machine, and how to control or disable it. It reflects the current state of
this fork, which has been hardened to make a default launch network-quiet.

## What is NOT collected

MiMoCode does **not** send any usage analytics, telemetry, or product metrics.

- There is no background reporting of your activity to any server.
- No prompt text, file contents, source code, file paths, or command output is
  ever transmitted as telemetry.
- No persistent installation ID or device fingerprint is generated or sent.

The model/tool usage events that exist internally (`metrics.model_call`,
`metrics.tool_call`, `metrics.agent_request`) are published only on the local
in-process event bus and exposed over the local SDK event stream. They never
leave your machine.

## Network calls and how to control them

| What | When | Destination | Default | Off switch |
| --- | --- | --- | --- | --- |
| **LLM requests** | When you send a message | The provider you configured (Anthropic, OpenAI, MiMo, …) | On (inherent) | Choose your provider / model |
| **MiMo account login** | Only when you run the MiMo login flow | `platform.xiaomimimo.com` | **Off** (provider not registered) | Opt in with `MIMOCODE_ENABLE_MIMO=true` |
| **Model registry refresh** | Startup + hourly poll | `models.dev` | **Off** | Opt in with `MIMOCODE_ENABLE_MODELS_FETCH=true` |
| **Language server downloads** | First use of a language that needs an LSP | GitHub / Eclipse / JetBrains | On (on demand) | `MIMOCODE_DISABLE_LSP_DOWNLOAD=true` |
| **Update check** | — | — | **Disabled** | n/a (auto-update removed) |
| **Manual upgrade** | Only when you run `mimocode upgrade` | `mimo.xiaomi.com/install` or your package manager | Off until you run it | Don't run the command |
| **OpenTelemetry export** | Per request, if configured | Your OTLP endpoint | **Off** | Set `OTEL_EXPORTER_OTLP_ENDPOINT` to enable |
| **Web/search tools** | When the agent uses them | The fetched URL / Exa | On demand | Don't enable / use those tools |

### Model registry (`models.dev`)

`models.dev` is a third-party registry (not affiliated with MiMo/Xiaomi) that
supplies model metadata — context limits, pricing, and capabilities — for
**all** providers, not just MiMo. MiMoCode ships a build-time snapshot of this
data and caches it on disk, so a normal launch resolves models offline with no
network call.

- To refresh metadata in the background, set `MIMOCODE_ENABLE_MODELS_FETCH=true`.
- To serve it from a local file, set `MIMOCODE_MODELS_PATH=/path/to/api.json`.
- To self-host the registry, set `MIMOCODE_MODELS_URL=https://your-host`.
- To hard-disable any fetch (even the one-time fallback when no snapshot/cache
  exists), set `MIMOCODE_DISABLE_MODELS_FETCH=true`.

## Running fully offline / Xiaomi-free

```bash
export MIMOCODE_DISABLE_LSP_DOWNLOAD=true   # no language-server downloads
export MIMOCODE_DISABLE_MODELS_FETCH=true   # never contact models.dev
# Configure a non-MiMo provider via its API key, e.g.:
export ANTHROPIC_API_KEY=...                # or OPENAI_API_KEY, etc.
```

With the above, and without logging in to MiMo, the only outbound traffic is to
the LLM provider you explicitly chose.
