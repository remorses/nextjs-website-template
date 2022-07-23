/**
 Schema Generated with mysql-schema-ts 1.9.0
*/

/**
 * Exposes all fields present in Account as a typescript
 * interface.
 */
export interface SqlAccount {
  access_token?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  expires_at?: number | null
  id: string
  id_token?: string | null
  oauth_token?: string | null
  oauth_token_secret?: string | null
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  scope?: string | null
  session_state?: string | null
  token_type?: string | null
  type: string
  updatedAt: Date
  userId: string
}

/**
 * Exposes the same fields as SqlAccount,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlAccountWithDefaults {
  access_token?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  expires_at?: number | null
  id: string
  id_token?: string | null
  oauth_token?: string | null
  oauth_token_secret?: string | null
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  scope?: string | null
  session_state?: string | null
  token_type?: string | null
  type: string
  updatedAt: Date
  userId: string
}
/**
 * Exposes all fields present in Domain as a typescript
 * interface.
 */
export interface SqlDomain {
  domainType: 'customDomain' | 'internalDomain'
  host: string
  id: string
  siteId: string
}

/**
 * Exposes the same fields as SqlDomain,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlDomainWithDefaults {
  domainType: 'customDomain' | 'internalDomain'
  host: string
  id: string
  siteId: string
}
/**
 * Exposes all fields present in Price as a typescript
 * interface.
 */
export interface SqlPrice {
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  currency: string
  isSandbox: number
  paddleId: string
  unitAmount: number
  updatedAt: Date
}

/**
 * Exposes the same fields as SqlPrice,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlPriceWithDefaults {
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  currency: string
  isSandbox: number
  paddleId: string
  unitAmount: number
  updatedAt: Date
}
/**
 * Exposes all fields present in Product as a typescript
 * interface.
 */
export interface SqlProduct {
  /**  Defaults to: 1. */
  active: number
  billing_period: number
  billing_type: string
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  image?: string | null
  isSandbox: number
  name: string
  paddleId: string
  trial_days: number
  updatedAt: Date
}

/**
 * Exposes the same fields as SqlProduct,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlProductWithDefaults {
  /**  Defaults to: 1. */
  active?: number
  billing_period: number
  billing_type: string
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  image?: string | null
  isSandbox: number
  name: string
  paddleId: string
  trial_days: number
  updatedAt: Date
}
/**
 * Exposes all fields present in Route as a typescript
 * interface.
 */
export interface SqlRoute {
  basePath: string
  id: string
  siteId: string
  targetUrl: string
}

/**
 * Exposes the same fields as SqlRoute,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlRouteWithDefaults {
  basePath: string
  id: string
  siteId: string
  targetUrl: string
}
/**
 * Exposes all fields present in Site as a typescript
 * interface.
 */
export interface SqlSite {
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  id: string
  name?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  updatedAt: Date
}

/**
 * Exposes the same fields as SqlSite,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlSiteWithDefaults {
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  id: string
  name?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  updatedAt?: Date
}
/**
 * Exposes all fields present in SiteInviteLink as a typescript
 * interface.
 */
export interface SqlSiteInviteLink {
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  key: string
  siteId: string
}

/**
 * Exposes the same fields as SqlSiteInviteLink,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlSiteInviteLinkWithDefaults {
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  key: string
  siteId: string
}
/**
 * Exposes all fields present in SitesUsers as a typescript
 * interface.
 */
export interface SqlSitesUsers {
  role: 'ADMIN' | 'GUEST'
  siteId: string
  userId: string
}

/**
 * Exposes the same fields as SqlSitesUsers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlSitesUsersWithDefaults {
  role: 'ADMIN' | 'GUEST'
  siteId: string
  userId: string
}
/**
 * Exposes all fields present in Subscription as a typescript
 * interface.
 */
export interface SqlSubscription {
  cancel_url?: string | null
  canceled_at?: Date | null
  cancellation_effective_date?: Date | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  currency?: string | null
  id: string
  isSandbox: number
  marketing_consent?: number | null
  paddleEmail?: string | null
  paddleSubscriptionId: string
  paddleUserId: string
  paused_at?: Date | null
  paused_from?: Date | null
  paused_reason?: string | null
  productId: string
  siteId: string
  start_date?: Date | null
  status: 'past_due' | 'active' | 'paused' | 'trialing' | 'deleted'
  unit_price?: string | null
  update_url?: string | null
  updatedAt: Date
}

/**
 * Exposes the same fields as SqlSubscription,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlSubscriptionWithDefaults {
  cancel_url?: string | null
  canceled_at?: Date | null
  cancellation_effective_date?: Date | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  currency?: string | null
  id: string
  isSandbox: number
  marketing_consent?: number | null
  paddleEmail?: string | null
  paddleSubscriptionId: string
  paddleUserId: string
  paused_at?: Date | null
  paused_from?: Date | null
  paused_reason?: string | null
  productId: string
  siteId: string
  start_date?: Date | null
  status: 'past_due' | 'active' | 'paused' | 'trialing' | 'deleted'
  unit_price?: string | null
  update_url?: string | null
  updatedAt: Date
}
/**
 * Exposes all fields present in User as a typescript
 * interface.
 */
export interface SqlUser {
  defaultSiteId?: string | null
  email?: string | null
  emailVerified?: Date | null
  id: string
  image?: string | null
  name?: string | null
  signupReason?: string | null
}

/**
 * Exposes the same fields as SqlUser,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlUserWithDefaults {
  defaultSiteId?: string | null
  email?: string | null
  emailVerified?: Date | null
  id: string
  image?: string | null
  name?: string | null
  signupReason?: string | null
}
/**
 * Exposes all fields present in VerificationToken as a typescript
 * interface.
 */
export interface SqlVerificationToken {
  expires: Date
  identifier: string
  token: string
}

/**
 * Exposes the same fields as SqlVerificationToken,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlVerificationTokenWithDefaults {
  expires: Date
  identifier: string
  token: string
}
