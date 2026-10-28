export default defineEventHandler((event) => {
  const c = useRuntimeConfig(event)
  const nonEmpty = (v?: string) => typeof v === 'string' && v.trim().length > 0

  const sessionPwd = (c.session?.password ?? '') as string
  const env = ((event.context as any).cloudflare?.env ?? {}) as Record<string, unknown>

  return {
    session: { present: nonEmpty(sessionPwd), length: sessionPwd.length, ok32: sessionPwd.length >= 32 },
    google: { clientId: nonEmpty(c.oauth?.google?.clientId), clientSecret: nonEmpty(c.oauth?.google?.clientSecret) },
    stripe: { secretKey: nonEmpty(c.stripe?.secretKey), webhookSecret: nonEmpty(c.stripe?.webhookSecret) },
    venice: { key: nonEmpty(c.veniceApiKey), model: c.veniceModel },
    cloudflareBindings: Object.keys(env).sort(),
  }
})
