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
}

const ClaimReceived = ({ name, educatorName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your listing claim</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Thanks, ${name}!` : 'Thanks for your claim!'}
        </Heading>
        <Text style={text}>
          We've received your claim{educatorName ? ` for ${educatorName}` : ''} on the {SITE_NAME} educator
          directory. Our team will review it and get back to you within a few business days.
        </Text>
        <Text style={text}>
          Once verified, you'll be able to update your listing details, booking links, and earn a verified badge.
        </Text>
        <Text style={footer}>— The {SITE_NAME} team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ClaimReceived,
  subject: 'We received your listing claim',
  displayName: 'Claim received',
  previewData: { name: 'Jane', educatorName: 'St John First Aid' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: 'hsl(220, 20%, 14%)', margin: '0 0 18px' }
const text = { fontSize: '15px', color: 'hsl(220, 9%, 46%)', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '13px', color: '#999', margin: '28px 0 0' }
