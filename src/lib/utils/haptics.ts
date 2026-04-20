import { browser } from '$app/environment'
import { WebHaptics } from 'web-haptics'

// Singleton instance — no-ops on server and unsupported browsers (desktop)
export const haptic = browser ? new WebHaptics() : { trigger() {} }
