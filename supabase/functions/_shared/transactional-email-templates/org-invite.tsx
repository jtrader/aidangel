/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'First Aid Angel'

interface Props {
  fullName?: string
  orgName?: string
  joinUrl?: string
  role?: string
}

const OrgInvite = ({ fullName, orgName, joinUrl, role }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{orgName ? `${orgName} invited you to ${SITE_NAME}` : `You've been invited to ${SITE_NAME}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {fullName ? `Hi ${fullName},` : 'Hello,'}
        </Heading>
        <Text style={text}>
          <strong>{orgName ?? 'Your organisation'}</strong> has invited you to join their {SITE_NAME} workspace
          {role ? ` as a ${role}` : ''} for first-aid training and CPD compliance.
        </Text>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={joinUrl ?? '#'} style={button}>Accept invitation</Button>
        </Section>
        <Text style={small}>
          Or paste this link into your browser: <br />
          <span style={{ wordBreak: 'break-all' }}>{joinUrl}</span>
        </Text>
        <Text style={footer}>— The {SITE_NAME} team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrgInvite,
  subject: (d: Record<string, any>) =>
    d.orgName ? `${d.orgName} invited you to ${SITE_NAME}` : `You've been invited to ${SITE_NAME}`,
  displayName: 'Organisation invitation',
  previewData: {
    fullName: 'Alice',
    orgName: 'Acme Pty Ltd',
    role: 'learner',
    joinUrl: 'https://firstaidangel.org/join/example-token',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: 'hsl(220, 20%, 14%)', margin: '0 0 18px' }
const text = { fontSize: '15px', color: 'hsl(220, 9%, 46%)', lineHeight: '1.6', margin: '0 0 16px' }
const small = { fontSize: '12px', color: '#888', lineHeight: '1.5', margin: '0 0 16px' }
const button = {
  backgroundColor: 'hsl(0, 72%, 51%)', color: '#ffffff', padding: '12px 22px',
  borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px',
}
const footer = { fontSize: '13px', color: '#999', margin: '28px 0 0' }
