/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'First Aid Angel'

interface Props {
  name?: string
  educatorName?: string
  profileUrl?: string
  notes?: string
}

const ClaimApproved = ({ name, educatorName, profileUrl, notes }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your listing claim has been approved</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Good news, ${name}!` : 'Your claim is approved'}
        </Heading>
        <Text style={text}>
          Your claim{educatorName ? ` for ${educatorName}` : ''} on the {SITE_NAME} educator directory has been
          verified. Your listing now shows a verified badge.
        </Text>
        {notes && <Text style={noteBox}>Note from our team: {notes}</Text>}
        {profileUrl && (
          <Button href={profileUrl} style={button}>
            View your listing
          </Button>
        )}
        <Text style={footer}>Thanks for helping people learn life-saving skills. — The {SITE_NAME} team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ClaimApproved,
  subject: 'Your listing claim has been approved',
  displayName: 'Claim approved',
  previewData: {
    name: 'Jane',
    educatorName: 'St John First Aid',
    profileUrl: 'https://firstaidangel.org/learn/provider/st-john',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: 'hsl(220, 20%, 14%)', margin: '0 0 18px' }
const text = { fontSize: '15px', color: 'hsl(220, 9%, 46%)', lineHeight: '1.6', margin: '0 0 16px' }
const noteBox = {
  fontSize: '14px', color: 'hsl(220, 20%, 14%)', lineHeight: '1.5',
  backgroundColor: '#fff7ed', padding: '12px 14px', borderRadius: '12px', margin: '0 0 18px',
}
const button = {
  backgroundColor: 'hsl(0, 72%, 51%)', color: '#ffffff', padding: '12px 20px',
  borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold',
  display: 'inline-block', margin: '8px 0 18px',
}
const footer = { fontSize: '13px', color: '#999', margin: '24px 0 0' }
