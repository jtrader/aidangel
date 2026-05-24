-- Sequences for human-readable certificate numbers
CREATE SEQUENCE IF NOT EXISTS public.program_certificate_number_seq START 1;

-- =====================
-- programs
-- =====================
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  description text,
  cover_url text,
  pass_mark integer NOT NULL DEFAULT 80,
  duration_minutes integer NOT NULL DEFAULT 60,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published programs" ON public.programs
  FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage programs" ON public.programs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER programs_updated BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================
-- program_topics (ordered list of courses inside a program)
-- =====================
CREATE TABLE public.program_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (program_id, course_id)
);
ALTER TABLE public.program_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read program topics" ON public.program_topics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.programs p WHERE p.id = program_id AND (p.is_published OR has_role(auth.uid(), 'admin'::app_role)))
  );
CREATE POLICY "Admins manage program topics" ON public.program_topics
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_program_topics_program ON public.program_topics(program_id, sort_order);

-- =====================
-- program_quiz_questions (program-level final quiz)
-- =====================
CREATE TABLE public.program_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  question text NOT NULL,
  choices jsonb NOT NULL,
  correct_index integer NOT NULL,
  explanation text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.program_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view program quiz of published" ON public.program_quiz_questions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.programs p WHERE p.id = program_id AND (p.is_published OR has_role(auth.uid(), 'admin'::app_role)))
  );
CREATE POLICY "Admins manage program quiz" ON public.program_quiz_questions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER program_quiz_updated BEFORE UPDATE ON public.program_quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================
-- program_quiz_attempts
-- =====================
CREATE TABLE public.program_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total integer NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.program_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own program attempts" ON public.program_quiz_attempts
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users insert own program attempts" ON public.program_quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- program_enrollments
-- =====================
CREATE TABLE public.program_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, program_id)
);
ALTER TABLE public.program_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own program enrollments" ON public.program_enrollments
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users create own program enrollments" ON public.program_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own program enrollments" ON public.program_enrollments
  FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- program_certificates
-- =====================
CREATE TABLE public.program_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  learner_name text NOT NULL,
  certificate_number text NOT NULL UNIQUE DEFAULT ('PRG-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.program_certificate_number_seq')::text, 6, '0')),
  issued_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.program_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own program certs" ON public.program_certificates
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users create own program certs" ON public.program_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update verify_certificate to also resolve program certs
CREATE OR REPLACE FUNCTION public.verify_certificate(_cert_number text)
RETURNS TABLE(certificate_number text, course_title text, issued_at timestamptz, learner_initial text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.certificate_number, co.title, c.issued_at, left(c.learner_name, 1)
  FROM public.certificates c JOIN public.courses co ON co.id = c.course_id
  WHERE c.certificate_number = _cert_number
  UNION ALL
  SELECT pc.certificate_number, p.title, pc.issued_at, left(pc.learner_name, 1)
  FROM public.program_certificates pc JOIN public.programs p ON p.id = pc.program_id
  WHERE pc.certificate_number = _cert_number
$$;

-- =====================
-- org_program_assignments (employer-assigned programs)
-- =====================
CREATE TABLE public.org_program_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.org_members(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  assigned_by uuid,
  due_at timestamptz,
  status org_assignment_status NOT NULL DEFAULT 'assigned',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, member_id, program_id)
);
ALTER TABLE public.org_program_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read program assignments in their org" ON public.org_program_assignments
  FOR SELECT USING (is_org_member(auth.uid(), org_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Managers manage program assignments" ON public.org_program_assignments
  FOR ALL USING (has_org_role(auth.uid(), org_id, 'manager'::org_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_org_role(auth.uid(), org_id, 'manager'::org_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER org_program_assignments_updated BEFORE UPDATE ON public.org_program_assignments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================
-- Auto-complete program assignment when learner finishes
-- =====================
CREATE OR REPLACE FUNCTION public.mark_program_assignment_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_program_id uuid;
  v_topic_count int;
  v_topics_passed int;
  v_has_final_quiz boolean;
  v_passed_final boolean;
BEGIN
  -- For each program containing the freshly-passed course, re-evaluate completion
  FOR v_program_id IN
    SELECT DISTINCT pt.program_id FROM public.program_topics pt WHERE pt.course_id = NEW.course_id
  LOOP
    SELECT count(*) INTO v_topic_count FROM public.program_topics WHERE program_id = v_program_id;
    SELECT count(DISTINCT qa.course_id) INTO v_topics_passed
      FROM public.quiz_attempts qa
      JOIN public.program_topics pt ON pt.course_id = qa.course_id AND pt.program_id = v_program_id
      WHERE qa.user_id = NEW.user_id AND qa.passed = true;

    SELECT EXISTS(SELECT 1 FROM public.program_quiz_questions WHERE program_id = v_program_id) INTO v_has_final_quiz;
    SELECT EXISTS(SELECT 1 FROM public.program_quiz_attempts WHERE program_id = v_program_id AND user_id = NEW.user_id AND passed = true) INTO v_passed_final;

    IF v_topics_passed >= v_topic_count AND (NOT v_has_final_quiz OR v_passed_final) THEN
      UPDATE public.org_program_assignments a
        SET status = 'completed', completed_at = now()
        FROM public.org_members m
        WHERE a.member_id = m.id AND a.program_id = v_program_id AND m.user_id = NEW.user_id AND a.status <> 'completed';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_program_complete_after_topic
AFTER INSERT ON public.quiz_attempts
FOR EACH ROW WHEN (NEW.passed = true)
EXECUTE FUNCTION public.mark_program_assignment_completed();

-- Re-check after a program final-quiz pass too
CREATE OR REPLACE FUNCTION public.mark_program_assignment_after_final()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_topic_count int;
  v_topics_passed int;
BEGIN
  SELECT count(*) INTO v_topic_count FROM public.program_topics WHERE program_id = NEW.program_id;
  SELECT count(DISTINCT qa.course_id) INTO v_topics_passed
    FROM public.quiz_attempts qa
    JOIN public.program_topics pt ON pt.course_id = qa.course_id AND pt.program_id = NEW.program_id
    WHERE qa.user_id = NEW.user_id AND qa.passed = true;

  IF v_topics_passed >= v_topic_count THEN
    UPDATE public.org_program_assignments a
      SET status = 'completed', completed_at = now()
      FROM public.org_members m
      WHERE a.member_id = m.id AND a.program_id = NEW.program_id AND m.user_id = NEW.user_id AND a.status <> 'completed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_program_complete_after_final
AFTER INSERT ON public.program_quiz_attempts
FOR EACH ROW WHEN (NEW.passed = true)
EXECUTE FUNCTION public.mark_program_assignment_after_final();