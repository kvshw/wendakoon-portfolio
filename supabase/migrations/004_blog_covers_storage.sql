insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-covers', 'blog-covers', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Public read blog covers" on storage.objects;

create policy "Public read blog covers"
on storage.objects for select
to public
using (bucket_id = 'blog-covers');
