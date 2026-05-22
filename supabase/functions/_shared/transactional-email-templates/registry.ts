/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as claimReceived } from './claim-received.tsx'
import { template as claimApproved } from './claim-approved.tsx'
import { template as claimRejected } from './claim-rejected.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'claim-received': claimReceived,
  'claim-approved': claimApproved,
  'claim-rejected': claimRejected,
}
