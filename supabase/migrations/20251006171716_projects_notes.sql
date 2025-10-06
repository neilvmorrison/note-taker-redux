create type "public"."collaborator_roles" as enum ('owner', 'editor', 'reader');

create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "deleted_at" timestamp without time zone,
    "title" text,
    "content" jsonb,
    "author_id" uuid
);


create table "public"."project_collaborators" (
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "deleted_at" timestamp without time zone,
    "user_profile_id" uuid,
    "project_id" uuid,
    "role" collaborator_roles default 'reader'::collaborator_roles
);


create table "public"."project_notes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp without time zone default now(),
    "deleted_at" timestamp without time zone,
    "project_id" uuid,
    "note_id" uuid
);


CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX project_notes_pkey ON public.project_notes USING btree (id);

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."project_notes" add constraint "project_notes_pkey" PRIMARY KEY using index "project_notes_pkey";

alter table "public"."notes" add constraint "notes_author_id_fkey" FOREIGN KEY (author_id) REFERENCES user_profiles(id) not valid;

alter table "public"."notes" validate constraint "notes_author_id_fkey";

alter table "public"."project_collaborators" add constraint "project_collaborators_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."project_collaborators" validate constraint "project_collaborators_project_id_fkey";

alter table "public"."project_collaborators" add constraint "project_collaborators_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."project_collaborators" validate constraint "project_collaborators_user_profile_id_fkey";

alter table "public"."project_notes" add constraint "project_notes_note_id_fkey" FOREIGN KEY (note_id) REFERENCES notes(id) not valid;

alter table "public"."project_notes" validate constraint "project_notes_note_id_fkey";

alter table "public"."project_notes" add constraint "project_notes_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."project_notes" validate constraint "project_notes_project_id_fkey";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."project_collaborators" to "anon";

grant insert on table "public"."project_collaborators" to "anon";

grant references on table "public"."project_collaborators" to "anon";

grant select on table "public"."project_collaborators" to "anon";

grant trigger on table "public"."project_collaborators" to "anon";

grant truncate on table "public"."project_collaborators" to "anon";

grant update on table "public"."project_collaborators" to "anon";

grant delete on table "public"."project_collaborators" to "authenticated";

grant insert on table "public"."project_collaborators" to "authenticated";

grant references on table "public"."project_collaborators" to "authenticated";

grant select on table "public"."project_collaborators" to "authenticated";

grant trigger on table "public"."project_collaborators" to "authenticated";

grant truncate on table "public"."project_collaborators" to "authenticated";

grant update on table "public"."project_collaborators" to "authenticated";

grant delete on table "public"."project_collaborators" to "service_role";

grant insert on table "public"."project_collaborators" to "service_role";

grant references on table "public"."project_collaborators" to "service_role";

grant select on table "public"."project_collaborators" to "service_role";

grant trigger on table "public"."project_collaborators" to "service_role";

grant truncate on table "public"."project_collaborators" to "service_role";

grant update on table "public"."project_collaborators" to "service_role";

grant delete on table "public"."project_notes" to "anon";

grant insert on table "public"."project_notes" to "anon";

grant references on table "public"."project_notes" to "anon";

grant select on table "public"."project_notes" to "anon";

grant trigger on table "public"."project_notes" to "anon";

grant truncate on table "public"."project_notes" to "anon";

grant update on table "public"."project_notes" to "anon";

grant delete on table "public"."project_notes" to "authenticated";

grant insert on table "public"."project_notes" to "authenticated";

grant references on table "public"."project_notes" to "authenticated";

grant select on table "public"."project_notes" to "authenticated";

grant trigger on table "public"."project_notes" to "authenticated";

grant truncate on table "public"."project_notes" to "authenticated";

grant update on table "public"."project_notes" to "authenticated";

grant delete on table "public"."project_notes" to "service_role";

grant insert on table "public"."project_notes" to "service_role";

grant references on table "public"."project_notes" to "service_role";

grant select on table "public"."project_notes" to "service_role";

grant trigger on table "public"."project_notes" to "service_role";

grant truncate on table "public"."project_notes" to "service_role";

grant update on table "public"."project_notes" to "service_role";


