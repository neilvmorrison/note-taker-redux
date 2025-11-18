-- Create user_uploads table
create table "public"."user_uploads" (
  "id" uuid not null default gen_random_uuid(),
  "auth_user_id" uuid not null,
  "storage_path" text not null,
  "url" text not null,
  "filename" text not null,
  "file_size" bigint not null,
  "mime_type" text not null,
  "note_id" uuid,
  "created_at" timestamp with time zone default now()
);

-- Add primary key
alter table "public"."user_uploads" add constraint "user_uploads_pkey" primary key ("id");

-- Add foreign keys
alter table "public"."user_uploads" add constraint "user_uploads_auth_user_id_fkey" 
  foreign key ("auth_user_id") references "auth"."users"("id") on delete cascade;

alter table "public"."user_uploads" add constraint "user_uploads_note_id_fkey" 
  foreign key ("note_id") references "public"."notes"("id") on delete set null;

-- Create indexes
create index "idx_user_uploads_auth_user_id" on "public"."user_uploads" using btree ("auth_user_id");
create index "idx_user_uploads_note_id" on "public"."user_uploads" using btree ("note_id");

-- Grant permissions
grant select, insert, update, delete on table "public"."user_uploads" to "authenticated";
grant select on table "public"."user_uploads" to "service_role";

-- Enable RLS
alter table "public"."user_uploads" enable row level security;

-- RLS policies for user_uploads table
create policy "Users can view their own uploads"
  on "public"."user_uploads"
  for select
  to authenticated
  using (auth.uid() = auth_user_id);

create policy "Users can insert their own uploads"
  on "public"."user_uploads"
  for insert
  to authenticated
  with check (auth.uid() = auth_user_id);

create policy "Users can update their own uploads"
  on "public"."user_uploads"
  for update
  to authenticated
  using (auth.uid() = auth_user_id);

create policy "Users can delete their own uploads"
  on "public"."user_uploads"
  for delete
  to authenticated
  using (auth.uid() = auth_user_id);

-- Create user_avatars storage bucket (if it doesn't exist)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user_avatars',
  'user_avatars',
  true,
  5242880, -- 5MB in bytes
  array['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS policies for user_avatars bucket
drop policy if exists "Public can view avatars" on storage.objects;
create policy "Public can view avatars"
  on storage.objects
  for select
  to public
  using (bucket_id = 'user_avatars');

drop policy if exists "Authenticated users can upload their own avatar" on storage.objects;
create policy "Authenticated users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create user_uploads storage bucket (if it doesn't exist)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user_uploads',
  'user_uploads',
  true,
  10485760, -- 10MB in bytes
  array['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS policies for user_uploads bucket
drop policy if exists "Anyone can view uploads" on storage.objects;
create policy "Anyone can view uploads"
  on storage.objects
  for select
  to public
  using (bucket_id = 'user_uploads');

drop policy if exists "Users can upload their own files" on storage.objects;
create policy "Users can upload their own files"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'user_uploads' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own files" on storage.objects;
create policy "Users can update their own files"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'user_uploads' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own files" on storage.objects;
create policy "Users can delete their own files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'user_uploads' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

