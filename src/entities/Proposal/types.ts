import { MAX_NAME_SIZE, MIN_NAME_SIZE } from "./utils"

export type ProposalAttributes<C extends {} = any> = {
  id: string
  snapshot_id: string
  snapshot_space: string
  snapshot_proposal: any
  snapshot_signature: string
  snapshot_network: string
  discourse_id: number
  discourse_topic_id: number
  discourse_topic_slug: string
  user: string
  title: string
  description: string,
  type: ProposalType
  status: ProposalStatus
  configuration: C
  start_at: Date
  finish_at: Date
  deleted: boolean
  deleted_by: string | null,
  enacted: boolean
  enacted_by: string | null
  enacted_description: string | null
  passed_by: string | null
  passed_description: string | null
  rejected_by: string | null
  rejected_description: string | null
  required_to_pass: number | null
  created_at: Date
  updated_at: Date
  total_vp: number
}

export enum ProposalStatus {
  Pending = 'pending',
  Active = 'active',
  Finished = 'finished',
  Rejected = 'rejected',
  Passed = 'passed',
  Enacted = 'enacted',
  Deleted = 'deleted'
}

export function isProposalStatus(value:  string | null | undefined): boolean {
  switch (value) {
    case ProposalStatus.Pending:
    case ProposalStatus.Finished:
    case ProposalStatus.Active:
    case ProposalStatus.Rejected:
    case ProposalStatus.Passed:
    case ProposalStatus.Enacted:
      return true
    default:
      return false
  }
}

export function toProposalStatus(value: string | null | undefined): ProposalStatus | null {
  return isProposalStatus(value)?
    value as ProposalStatus :
    null
}

export enum ProposalSorting {
  Participation = 'participation',
}

export function isProposalSorting(value:  string | null | undefined): boolean {
  switch (value) {
    case ProposalSorting.Participation:
      return true
    default:
      return false
  }
}

export function toProposalSorting(value: string | null | undefined): ProposalSorting | null {
  return isProposalSorting(value)?
    value as ProposalSorting :
    null
}


export enum ProposalType {
  POI = 'poi',
  Catalyst = 'catalyst',
  BanName = 'ban_name',
  Grant = 'grant',
  Poll = 'poll',
}

export function isProposalType(value:  string | null | undefined): boolean {
  switch (value) {
    case ProposalType.POI:
    case ProposalType.Catalyst:
    case ProposalType.BanName:
    case ProposalType.Grant:
    case ProposalType.Poll:
      return true
    default:
      return false
  }
}

export function toProposalType(value: string | null | undefined): ProposalType | null {
  return isProposalType(value)?
    value as ProposalType :
    null
}

function requiredVotingPower(value: string | undefined | null, defaultValue: number) {
  if (value === undefined || value === null) {
    return defaultValue
  }

  const vp = Number(value.replace(/_/gi, ''))
  if (Number.isFinite(vp) && vp >= 0) {
    return vp
  }

  return defaultValue
}

export const ProposalRequiredVP = {
  [ProposalType.Grant]: requiredVotingPower(process.env.GATSBY_VOTING_POWER_TO_PASS_GRANT, 0),
  [ProposalType.Catalyst]: requiredVotingPower(process.env.GATSBY_VOTING_POWER_TO_PASS_CATALYST, 0),
  [ProposalType.BanName]: requiredVotingPower(process.env.GATSBY_VOTING_POWER_TO_PASS_BAN_NAME, 0),
  [ProposalType.POI]: requiredVotingPower(process.env.GATSBY_VOTING_POWER_TO_PASS_POI, 0),
  [ProposalType.Poll]: requiredVotingPower(process.env.GATSBY_VOTING_POWER_TO_PASS_POLL, 0),
}

export type UpdateProposalStatusProposal = {
  status:
    | ProposalStatus.Rejected
    | ProposalStatus.Passed
    | ProposalStatus.Enacted
  description: string
}

export const updateProposalStatusScheme = {
  type: 'object',
  additionalProperties: false,
  required: [
    'status',
    'description',
  ],
  properties: {
    status: {
      type: 'string',
      enum: [
        ProposalStatus.Rejected,
        ProposalStatus.Passed,
        ProposalStatus.Enacted
      ]
    },
    description: {
      type: ['string', 'null']
    }
  }
}

export type NewProposalPoll = {
  title: string,
  description: string,
  choices: string[],
}

export const INVALID_PROPOSAL_POLL_OPTIONS ='Invalid question/options'

export const newProposalPollScheme = {
  type: 'object',
  additionalProperties: false,
  required: [
    'title',
    'description',
    'choices',
  ],
  properties: {
    title: {
      type: 'string',
      minLength: 5,
      maxLength: 200,
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 7000,
    },
    choices: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
      minItems: 2
    }
  }
}

export type NewProposalBanName = {
  name: string,
  description: string,
}

export const newProposalBanNameScheme = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'description'],
  properties: {
    name: {
      type: 'string',
      minLength: MIN_NAME_SIZE,
      maxLength: MAX_NAME_SIZE
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 250,
    }
  }
}

export type NewProposalPOI = {
  x: number,
  y: number,
  description: string,
}

export const newProposalPOIScheme = {
  type: 'object',
  additionalProperties: false,
  required: ['x', 'y', 'description'],
  properties: {
    x: {
      type: 'integer',
      minimum: -150,
      maximum: 150
    },
    y: {
      type: 'integer',
      minimum: -150,
      maximum: 150,
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 250,
    }
  }
}

export type NewProposalCatalyst = {
  owner: string,
  domain: string,
  description: string
}

export const newProposalCatalystScheme = {
  type: 'object',
  additionalProperties: false,
  required: ['owner', 'domain', 'description'],
  properties: {
    owner: {
      type: 'string',
      format: 'address'
    },
    domain: {
      type: 'string',
      format: 'domain'
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 250,
    }
  }
}

export enum ProposalGrantCategory {
  Community = 'Community',
  ContentCreator = 'Content Creator',
  PlatformContributor = 'Platform Contributor',
  Gaming = 'Gaming'
}

export function isProposalGrantCategory(value:  string | null | undefined): boolean {
  switch (value) {
    case ProposalGrantCategory.Community:
    case ProposalGrantCategory.ContentCreator:
    case ProposalGrantCategory.PlatformContributor:
    case ProposalGrantCategory.Gaming:
      return true
    default:
      return false
  }
}

export enum ProposalGrantTier {
  Tier1 = 'Tier 1: up to $1,500 USD in MANA, one-time payment',
  Tier2 = 'Tier 2: up to $3,000 USD in MANA, one-time payment',
  Tier3 = 'Tier 3: up to $5,000 USD in MANA, 3 months vesting (1 month cliff)',
  Tier4 = 'Tier 4: up to $60,000 USD, 6 months vesting (1 month cliff)',
  Tier5 = 'Tier 5: up to $120,000 USD, 6 months vesting (1 month cliff)',
  Tier6 = 'Tier 6: up to $240,000 USD, 6 months vesting (1 month cliff)',
}

export function isProposalGrantTier(value:  string | null | undefined): boolean {
  switch (value) {
    case ProposalGrantTier.Tier1:
    case ProposalGrantTier.Tier2:
    case ProposalGrantTier.Tier3:
    case ProposalGrantTier.Tier4:
    case ProposalGrantTier.Tier5:
    case ProposalGrantTier.Tier6:
      return true
    default:
      return false
  }
}

export type NewProposalGrant = {
  title: string,
  abstract: string,
  category: ProposalGrantCategory,
  tier: ProposalGrantTier,
  size: number,
  beneficiary: string,
  description: string,
  specification: string,
  personnel: string,
  roadmap: string
}

export const newProposalGrantScheme = {
  type: 'object',
  additionalProperties: false,
  required: [
    'title',
    'abstract',
    'category',
    'tier',
    'beneficiary',
    'description',
    'specification',
    'personnel',
    'roadmap'
  ],
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 80,
    },
    abstract: {
      type: 'string',
      minLength: 1,
      maxLength: 750,
    },
    category: {
      type: 'string',
      enum: [
        ProposalGrantCategory.Community,
        ProposalGrantCategory.ContentCreator,
        ProposalGrantCategory.PlatformContributor,
        ProposalGrantCategory.Gaming,
      ]
    },
    tier: {
      type: 'string',
      enum: [
        ProposalGrantTier.Tier1,
        ProposalGrantTier.Tier2,
        ProposalGrantTier.Tier3,
        ProposalGrantTier.Tier4,
        ProposalGrantTier.Tier5,
        ProposalGrantTier.Tier6,
      ]
    },
    size: {
      type: 'integer',
      min: 0
    },
    beneficiary: {
      type: 'string',
      format: 'address'
    },
    description: {
      type: 'string',
      minLength: 20,
      maxLength: 3500,
    },
    specification: {
      type: 'string',
      minLength: 20,
      maxLength: 3500,
    },
    personnel: {
      type: 'string',
      minLength: 20,
      maxLength: 1500,
    },
    roadmap: {
      type: 'string',
      minLength: 20,
      maxLength: 1500,
    }
  }
}