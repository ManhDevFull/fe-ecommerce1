const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const ensureTrailingSlash = (value: string) =>
  value.endsWith('/') ? value : `${value}/`;

export const gatewayOrigin = stripTrailingSlash(
  process.env.NEXT_PUBLIC_GATEWAY_ORIGIN ?? 'http://localhost:5200'
);

export const restApiBase =
  ensureTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL ?? `${gatewayOrigin}/api`
  );

export const chatApiBase =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? `${gatewayOrigin}/chat/api/chat`;

export const chatHubUrl =
  process.env.NEXT_PUBLIC_CHAT_HUB_URL ?? `${gatewayOrigin}/chatHub`;
