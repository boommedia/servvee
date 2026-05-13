-- Public storage bucket for uploaded PDF menus
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-pdfs',
  'menu-pdfs',
  true,
  20971520,                        -- 20 MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload into their own user-id folder
CREATE POLICY "Users upload own PDFs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'menu-pdfs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone can read (needed for public embed)
CREATE POLICY "Public read menu PDFs"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'menu-pdfs');

-- Users can delete their own files
CREATE POLICY "Users delete own PDFs"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'menu-pdfs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
