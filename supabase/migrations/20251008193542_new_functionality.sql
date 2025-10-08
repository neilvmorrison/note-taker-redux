create type "public"."collaborator_roles" as enum ('owner', 'editor', 'reader');

create type "public"."task_statuses" as enum ('not_started', 'in_progress', 'complete', 'wont_complete');

create table "public"."note_actions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "previous_state" text,
    "updated_state" text,
    "event_type" text,
    "note_id" uuid,
    "actor_id" uuid
);


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


create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "deleted_at" timestamp without time zone,
    "title" text not null,
    "description" text,
    "status" task_statuses default 'not_started'::task_statuses,
    "author_id" uuid,
    "assigned_to" uuid,
    "estimated_time_hours" integer,
    "due_date" timestamp without time zone
);


alter table "public"."user_profiles" add column "avatar_url" text;

CREATE UNIQUE INDEX note_actions_pkey ON public.note_actions USING btree (id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX project_notes_pkey ON public.project_notes USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

alter table "public"."note_actions" add constraint "note_actions_pkey" PRIMARY KEY using index "note_actions_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."project_notes" add constraint "project_notes_pkey" PRIMARY KEY using index "project_notes_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."note_actions" add constraint "note_actions_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES user_profiles(id) not valid;

alter table "public"."note_actions" validate constraint "note_actions_actor_id_fkey";

alter table "public"."note_actions" add constraint "note_actions_note_id_fkey" FOREIGN KEY (note_id) REFERENCES notes(id) not valid;

alter table "public"."note_actions" validate constraint "note_actions_note_id_fkey";

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

alter table "public"."tasks" add constraint "tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES user_profiles(id) not valid;

alter table "public"."tasks" validate constraint "tasks_assigned_to_fkey";

alter table "public"."tasks" add constraint "tasks_author_id_fkey" FOREIGN KEY (author_id) REFERENCES user_profiles(id) not valid;

alter table "public"."tasks" validate constraint "tasks_author_id_fkey";

grant delete on table "public"."note_actions" to "anon";

grant insert on table "public"."note_actions" to "anon";

grant references on table "public"."note_actions" to "anon";

grant select on table "public"."note_actions" to "anon";

grant trigger on table "public"."note_actions" to "anon";

grant truncate on table "public"."note_actions" to "anon";

grant update on table "public"."note_actions" to "anon";

grant delete on table "public"."note_actions" to "authenticated";

grant insert on table "public"."note_actions" to "authenticated";

grant references on table "public"."note_actions" to "authenticated";

grant select on table "public"."note_actions" to "authenticated";

grant trigger on table "public"."note_actions" to "authenticated";

grant truncate on table "public"."note_actions" to "authenticated";

grant update on table "public"."note_actions" to "authenticated";

grant delete on table "public"."note_actions" to "service_role";

grant insert on table "public"."note_actions" to "service_role";

grant references on table "public"."note_actions" to "service_role";

grant select on table "public"."note_actions" to "service_role";

grant trigger on table "public"."note_actions" to "service_role";

grant truncate on table "public"."note_actions" to "service_role";

grant update on table "public"."note_actions" to "service_role";

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

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";


