/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'First Aid Angel'

interface Props {
  name?: string
  educatorName?: string
  notes?: string
}

const ClaimRejected = ({ name, educatorName, notes }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Update on your listing claim</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Hi ${name},` : 'Update on your claim'}
        </Heading>
        <Text style={text}>
          We've reviewed your claim{educatorName ? ` for ${educatorName}` : ''} on the {SITE_NAME} educator
          directory and weren't able to verify it at this time.
        </Text>
        {notes && <Text style={noteBox}>Reviewer notes: {notes}</Text>}
        <Text style={text}>
          If you believe this is a mistake, please reply with additional evidence (a work email on the provider's
          domain, a link to a team page, or official documentation) and we'll take another look.
        </Text>
        <Text style={footer}>— The {SITE_NAME} team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ClaimRejected,
  subject: 'Update on your listing claim',
  displayName: 'Claim not approved',
  previewData: { name: 'Jane', educatorName: 'St John First Aid', notes: 'Could not verify domain ownership.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: 'hsl(220, 20%, 14%)', margin: '0 0 18px' }
const text = { fontSize: '15px', color: 'hsl(220, 9%, 46%)', lineHeight: '1.6', margin: '0 0 16px' }
const noteBox = {
  fontSize: '14px', color: 'hsl(220, 20%, 14%)', lineHeight: '1.5',
  backgroundColor: '#fef2f2', padding: '12px 14px', borderRadius: '12px', margin: '0 0 18px',
}
const footer = { fontSize: '13px', color: '#999', margin: '24px 0 0' }
