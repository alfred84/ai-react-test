import { setupServer } from 'msw/node'

import { handlers } from '@/test/msw/handlers'

/** MSW server shared by every unit/integration test. Override per test with `server.use()`. */
export const server = setupServer(...handlers)
