alter table "public"."projects" drop constraint "projects_slug_key";

drop index if exists "public"."projects_slug_key";

alter table "public"."chats" add column "last_viewed_at" timestamp without time zone;

alter table "public"."notes" add column "last_viewed_at" timestamp without time zone;

alter table "public"."projects" add column "last_viewed_at" timestamp without time zone;

CREATE UNIQUE INDEX projects_owner_id_slug_key ON public.projects USING btree (owner_id, slug);

alter table "public"."projects" add constraint "projects_owner_id_slug_key" UNIQUE using index "projects_owner_id_slug_key";



