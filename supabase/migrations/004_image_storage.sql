-- Extend menu-pdfs bucket to allow image uploads alongside PDFs
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]
WHERE id = 'menu-pdfs';
