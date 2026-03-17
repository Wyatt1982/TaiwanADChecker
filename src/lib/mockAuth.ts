export const MOCK_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true' ||
  process.env.ENABLE_MOCK_AUTH === 'true'

export function isMockAuthEnabled(): boolean {
  return MOCK_AUTH_ENABLED
}
