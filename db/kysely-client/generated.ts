/**
 Schema Generated with mysql-schema-ts 1.9.0
*/

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = Array<JSONValue>

/**
 * Exposes all fields present in Account as a typescript
 * interface.
 */
export interface SqlAccount {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  access_token?: string | null
  expires_at?: number | null
  token_type?: string | null
  scope?: string | null
  id_token?: string | null
  session_state?: string | null
  oauth_token_secret?: string | null
  oauth_token?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  updatedAt: Date
}

/**
 * Exposes the same fields as SqlAccount,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlAccountWithDefaults {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  access_token?: string | null
  expires_at?: number | null
  token_type?: string | null
  scope?: string | null
  id_token?: string | null
  session_state?: string | null
  oauth_token_secret?: string | null
  oauth_token?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  updatedAt: Date
}
/**
 * Exposes all fields present in Campaign as a typescript
 * interface.
 */
export interface SqlCampaign {
  id: string
  name?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  updatedAt: Date
  twitterQueries: JSONValue
  orgId: string
}

/**
 * Exposes the same fields as SqlCampaign,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlCampaignWithDefaults {
  id: string
  name?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  updatedAt: Date
  twitterQueries: JSONValue
  orgId: string
}
/**
 * Exposes all fields present in Org as a typescript
 * interface.
 */
export interface SqlOrg {
  id: string
  name: string
}

/**
 * Exposes the same fields as SqlOrg,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlOrgWithDefaults {
  id: string
  name: string
}
/**
 * Exposes all fields present in OrgsUsers as a typescript
 * interface.
 */
export interface SqlOrgsUsers {
  userId: string
  orgId: string
  /**  Defaults to: user. */
  role: 'admin' | 'user'
}

/**
 * Exposes the same fields as SqlOrgsUsers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlOrgsUsersWithDefaults {
  userId: string
  orgId: string
  /**  Defaults to: user. */
  role?: 'admin' | 'user'
}
/**
 * Exposes all fields present in Price as a typescript
 * interface.
 */
export interface SqlPrice {
  isSandbox: number
  paddleId: string
  currency: string
  unitAmount: number
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
}

/**
 * Exposes the same fields as SqlPrice,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlPriceWithDefaults {
  isSandbox: number
  paddleId: string
  currency: string
  unitAmount: number
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
}
/**
 * Exposes all fields present in Product as a typescript
 * interface.
 */
export interface SqlProduct {
  isSandbox: number
  paddleId: string
  name: string
  /**  Defaults to: 1. */
  active: number
  image?: string | null
  billing_type: string
  billing_period: number
  trial_days: number
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
}

/**
 * Exposes the same fields as SqlProduct,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlProductWithDefaults {
  isSandbox: number
  paddleId: string
  name: string
  /**  Defaults to: 1. */
  active?: number
  image?: string | null
  billing_type: string
  billing_period: number
  trial_days: number
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
}
/**
 * Exposes all fields present in ScrapedTweet as a typescript
 * interface.
 */
export interface SqlScrapedTweet {
  id: string
  tweetId: string
  campaignId: string
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  /**  Defaults to: waiting. */
  state: 'waiting' | 'skipped' | 'replied'
  /**  Defaults to: twitter. */
  platform: 'twitter' | 'reddit' | 'hackernews'
}

/**
 * Exposes the same fields as SqlScrapedTweet,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlScrapedTweetWithDefaults {
  id: string
  tweetId: string
  campaignId: string
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  /**  Defaults to: waiting. */
  state?: 'waiting' | 'skipped' | 'replied'
  /**  Defaults to: twitter. */
  platform?: 'twitter' | 'reddit' | 'hackernews'
}
/**
 * Exposes all fields present in Subscription as a typescript
 * interface.
 */
export interface SqlSubscription {
  paddleUserId: string
  isSandbox: number
  id: string
  productId: string
  paddleSubscriptionId: string
  status: 'past_due' | 'active' | 'paused' | 'trialing' | 'deleted'
  cancel_url?: string | null
  update_url?: string | null
  paddleEmail?: string | null
  marketing_consent?: number | null
  paused_at?: Date | null
  paused_reason?: string | null
  paused_from?: Date | null
  start_date?: Date | null
  unit_price?: string | null
  currency?: string | null
  canceled_at?: Date | null
  cancellation_effective_date?: Date | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt: Date
  orgId: string
}

/**
 * Exposes the same fields as SqlSubscription,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlSubscriptionWithDefaults {
  paddleUserId: string
  isSandbox: number
  id: string
  productId: string
  paddleSubscriptionId: string
  status: 'past_due' | 'active' | 'paused' | 'trialing' | 'deleted'
  cancel_url?: string | null
  update_url?: string | null
  paddleEmail?: string | null
  marketing_consent?: number | null
  paused_at?: Date | null
  paused_reason?: string | null
  paused_from?: Date | null
  start_date?: Date | null
  unit_price?: string | null
  currency?: string | null
  canceled_at?: Date | null
  cancellation_effective_date?: Date | null
  /**  Defaults to: CURRENT_TIMESTAMP(3). */
  createdAt?: Date
  orgId: string
}
/**
 * Exposes all fields present in User as a typescript
 * interface.
 */
export interface SqlUser {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  defaultOrgId?: string | null
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
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  defaultOrgId?: string | null
  signupReason?: string | null
}
/**
 * Exposes all fields present in VerificationToken as a typescript
 * interface.
 */
export interface SqlVerificationToken {
  identifier: string
  token: string
  expires: Date
}

/**
 * Exposes the same fields as SqlVerificationToken,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface SqlVerificationTokenWithDefaults {
  identifier: string
  token: string
  expires: Date
}
