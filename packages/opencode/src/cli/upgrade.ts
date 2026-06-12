import { Log } from "@/util"

const log = Log.create({ service: "upgrade" })

// Automatic update checks are disabled in this build. Nothing is fetched on
// startup: no version lookup, no auto-upgrade, and no update notifications.
// Updating is left entirely to the user via the explicit `mimocode upgrade`
// command (or the package manager the CLI was installed with).
export async function upgrade() {
  log.info("automatic update check disabled")
}
