# Employer Admin System — Implementation Plan

A multi-tenant **Organisation** layer on top of the existing LMS so employers (workplaces, RTOs, councils, franchises) can buy seats, import their workforce in bulk, assign first-aid courses, and prove compliance.

## 1. Concepts

- **Organisation** — a tenant (e.g. "Bunnings Warehouse Pty Ltd").
- **Org member** — a user linked to an organisation with a role (`owner`, `admin`, `manager`, `learner`).
- **Seat / licence** — a paid slot that lets one learner take assigned courses.
- **Assignment** — links an employee to a course with optional due date.
- **Import job** — a CSV/XLSX upload that creates pending learners in bulk.
- **Compliance record** — derived from `quiz_attempts` + `certificates`, scoped per org.

## 2. Database schema (new tables)

```text
organisations            — id, name, slug, country_code, industry, billing_email, seat_limit, status, branding (logo_url, primary_color), created_by
org_members              — id, org_id, user_id (nullable until they sign up), email, full_name, role, employee_ref, department, status (invited|active|removed), invited_at
org_invitations          — id, org_id, email, token, role, expires_at, accepted_at
org_course_assignments   — id, org_id, member_id, course_id, due_at, assigned_by, status (assigned|in_progress|completed|overdue)
org_import_jobs          — id, org_id, uploaded_by, file_path, total_rows, success_rows, error_rows, error_report jsonb, status, created_at
org_audit_log            — id, org_id, actor_id, action, target_type, target_id, metadata jsonb, created_at
```

Extend `app_role` enum with `org_owner`, `org_admin`, `org_manager` (or use a separate `org_role` enum scoped to org_members). Roles outside an org stay in `user_roles`.

## 3. Security (RLS)

- Add SECURITY DEFINER helper: `is_org_member(_uid, _org_id, _min_role)` to avoid recursive policies.
- All `org_*` tables: members read their org's rows; only `owner`/`admin` mutate. Global `admin` (existing) can do everything for support.
- Tighten `course_enrollments` / `certificates` so an org admin can view rows for `user_id`s belonging to their org via the helper.

## 4. Bulk import pipeline

1. Admin uploads CSV/XLSX → stored in new private storage bucket `org-imports/<org_id>/<job_id>.csv`.
2. Edge function `org-import-process` (background): parses with `papaparse`/`xlsx`, validates emails/columns, dedupes against existing `org_members`, creates `org_members` rows in `invited` status, and queues invitation emails via the existing Resend transactional pipeline.
3. Job progress and per-row errors saved to `org_import_jobs.error_report` (downloadable as CSV).
4. Required CSV columns: `email`, `full_name`, optional `employee_ref`, `department`, `assign_course_slugs` (comma separated).

## 5. Invitation & onboarding

- Email contains a magic link to `/join/<token>` → user signs up (or signs in) and `org_invitations.accepted_at` is set, `org_members.user_id` linked, role applied.
- Auto-enrol the new user in any courses pre-assigned during import.

## 6. Course assignment & compliance

- Admin UI: pick members (filters: department/status) → pick courses → set due date → bulk assign.
- A trigger on `quiz_attempts` (when `passed=true`) updates the matching `org_course_assignments.status = 'completed'`.
- Nightly edge function `org-overdue-sweep` flips `assigned` → `overdue` past due date and sends digest emails.

## 7. Reporting

- Dashboard: seats used / remaining, % compliant, overdue list, course completion funnel, downloadable CSV/PDF.
- Per-employee certificate viewer (links to existing `/certificates/verify/:n`).
- Optional Postgres view `org_compliance_v` for fast reads.

## 8. Frontend routes (new)

```text
/employer                       — marketing + "Request a seat plan" CTA
/employer/dashboard             — KPIs, recent activity
/employer/people                — employee table, search, filters
/employer/people/import         — CSV upload + job history
/employer/assignments           — assign courses, due dates
/employer/reports               — compliance, exports
/employer/settings              — org profile, branding, seats, billing
/join/:token                    — invitation acceptance
```

Reuse shadcn `DataTable`, `Dialog`, `DropdownMenu`. New components: `OrgSwitcher`, `SeatMeter`, `ImportWizard`, `AssignmentBuilder`, `ComplianceTable`.

## 9. Billing (phase 2)

Stripe (or Paddle) subscription per org, metered by `seat_limit`. Webhook updates `organisations.seat_limit` & `status`. Importing past the limit blocks with a clear upgrade CTA.

## 10. Edge functions to add

- `org-import-process` — parse + ingest CSV/XLSX
- `org-invite-send` — issue invitation token + send email
- `org-overdue-sweep` — cron, marks overdue and emails managers
- `org-report-export` — generates CSV/PDF compliance reports

## 11. Delivery phases

1. **Foundations** — schema, RLS helpers, `OrgSwitcher`, manual single-employee add.
2. **Bulk import** — storage bucket, edge function, ImportWizard UI, invitation emails.
3. **Assignments + compliance** — assign flow, trigger, dashboard KPIs.
4. **Reporting + exports** — CSV/PDF, overdue sweep, audit log UI.
5. **Billing & branding** — Stripe seats, org logo/colors on learner certificates.

## 12. Open questions for you

1. Is one user allowed to belong to **multiple orgs** (e.g. a contractor)? (Schema above assumes yes.)
2. Should invited employees be allowed to **self-register without an email invite** using an org join code?
3. Billing: **Stripe** (preferred for global) or **Paddle** (handles AU GST automatically)?
4. Do we need **SSO/SAML** for enterprise customers on day one, or defer to phase 5?
5. Should certificates issued under an org show the **org's logo/branding**?

Reply with answers (or "use sensible defaults") and I'll start with phase 1.
