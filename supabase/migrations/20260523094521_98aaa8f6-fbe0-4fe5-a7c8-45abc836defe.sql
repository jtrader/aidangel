
CREATE TABLE public.course_translations (
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lang text NOT NULL,
  title text NOT NULL,
  summary text,
  description text,
  is_machine boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (course_id, lang)
);
ALTER TABLE public.course_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read course translations" ON public.course_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage course translations" ON public.course_translations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.lesson_translations (
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  lang text NOT NULL,
  title text NOT NULL,
  body text,
  is_machine boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lesson_id, lang)
);
ALTER TABLE public.lesson_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lesson translations" ON public.lesson_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage lesson translations" ON public.lesson_translations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.quiz_question_translations (
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  lang text NOT NULL,
  question text NOT NULL,
  choices jsonb NOT NULL,
  explanation text,
  is_machine boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (question_id, lang)
);
ALTER TABLE public.quiz_question_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read quiz translations" ON public.quiz_question_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage quiz translations" ON public.quiz_question_translations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_course_translations_lang ON public.course_translations(lang);
CREATE INDEX idx_lesson_translations_lang ON public.lesson_translations(lang);
CREATE INDEX idx_quiz_translations_lang ON public.quiz_question_translations(lang);
