CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: bug_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bug_type AS ENUM (
    'backend',
    'frontend',
    'ai',
    'prompt',
    'mixed',
    'other'
);


--
-- Name: company_size; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.company_size AS ENUM (
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '500+',
    'unknown'
);


--
-- Name: content_request_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.content_request_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'published'
);


--
-- Name: content_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.content_type AS ENUM (
    'video',
    'text',
    'document',
    'image'
);


--
-- Name: criticality_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.criticality_level AS ENUM (
    'critical',
    'medium',
    'low'
);


--
-- Name: feedback_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_category AS ENUM (
    'bug',
    'feature',
    'bug_prod'
);


--
-- Name: feedback_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_status AS ENUM (
    'new',
    'in_progress',
    'testing',
    'resolved',
    'closed'
);


--
-- Name: priority_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.priority_level AS ENUM (
    'urgent',
    'high',
    'medium',
    'low'
);


--
-- Name: team_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.team_type AS ENUM (
    'sav',
    'onboarding',
    'founders',
    'sales'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: increment_tutorial_view(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_tutorial_view(tutorial_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.tutorials
  SET view_count = view_count + 1
  WHERE id = tutorial_id;
END;
$$;


--
-- Name: update_agent_tutorial_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_agent_tutorial_count() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agents SET tutorial_count = tutorial_count + 1 WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agents SET tutorial_count = tutorial_count - 1 WHERE id = OLD.agent_id;
  END IF;
  RETURN NULL;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description_fr text NOT NULL,
    description_en text NOT NULL,
    avatar_url text,
    tutorial_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    description text NOT NULL,
    agent_id uuid,
    is_general boolean DEFAULT false,
    status public.content_request_status DEFAULT 'pending'::public.content_request_status,
    admin_response text,
    notified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    team_member_id uuid,
    criticality public.criticality_level NOT NULL,
    description text NOT NULL,
    client_email text NOT NULL,
    client_sector text,
    company_size public.company_size DEFAULT 'unknown'::public.company_size,
    hubspot_link text,
    status public.feedback_status DEFAULT 'new'::public.feedback_status,
    admin_notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    agent_id uuid,
    is_global boolean DEFAULT false,
    priority public.priority_level,
    merged_into_id uuid,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    jam_link text,
    secondary_jam_link text,
    assigned_developer text,
    bug_type public.bug_type,
    feedback_category public.feedback_category DEFAULT 'bug'::public.feedback_category,
    is_mandatory boolean DEFAULT false,
    follow_up_notes text
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    first_name text,
    last_name text,
    email text,
    phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    team public.team_type NOT NULL,
    is_manager boolean DEFAULT false,
    is_active boolean DEFAULT true,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: tutorials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tutorials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid,
    title_fr text NOT NULL,
    title_en text NOT NULL,
    description_fr text,
    description_en text,
    content_type public.content_type DEFAULT 'video'::public.content_type NOT NULL,
    duration text,
    content_url text,
    arcade_embed_url text,
    text_content_fr text,
    text_content_en text,
    is_published boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    view_count integer DEFAULT 0 NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'user'::public.app_role NOT NULL
);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: content_requests content_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_requests
    ADD CONSTRAINT content_requests_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: tutorials tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_feedbacks_agent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedbacks_agent_id ON public.feedbacks USING btree (agent_id);


--
-- Name: agents update_agents_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_requests update_content_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_requests_updated_at BEFORE UPDATE ON public.content_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: feedbacks update_feedbacks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_feedbacks_updated_at BEFORE UPDATE ON public.feedbacks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: team_members update_team_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tutorials update_tutorial_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tutorial_count AFTER INSERT OR DELETE ON public.tutorials FOR EACH ROW EXECUTE FUNCTION public.update_agent_tutorial_count();


--
-- Name: tutorials update_tutorials_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON public.tutorials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_requests content_requests_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_requests
    ADD CONSTRAINT content_requests_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: feedbacks feedbacks_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: feedbacks feedbacks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: feedbacks feedbacks_merged_into_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_merged_into_id_fkey FOREIGN KEY (merged_into_id) REFERENCES public.feedbacks(id);


--
-- Name: feedbacks feedbacks_team_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_team_member_id_fkey FOREIGN KEY (team_member_id) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tutorials tutorials_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agents Admins can manage agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage agents" ON public.agents TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: feedbacks Admins can manage all feedbacks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all feedbacks" ON public.feedbacks USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: content_requests Admins can manage content requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage content requests" ON public.content_requests TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: team_members Admins can manage team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage team members" ON public.team_members USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tutorials Admins can manage tutorials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage tutorials" ON public.tutorials TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: content_requests Admins can view all content requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all content requests" ON public.content_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tutorials Admins can view all tutorials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all tutorials" ON public.tutorials FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: content_requests Anyone can create content requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create content requests" ON public.content_requests FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: feedbacks Anyone can create feedbacks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);


--
-- Name: team_members Anyone can view active team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active team members" ON public.team_members FOR SELECT USING ((is_active = true));


--
-- Name: agents Anyone can view agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view agents" ON public.agents FOR SELECT TO authenticated, anon USING (true);


--
-- Name: feedbacks Anyone can view feedbacks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view feedbacks" ON public.feedbacks FOR SELECT USING (true);


--
-- Name: tutorials Anyone can view published tutorials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published tutorials" ON public.tutorials FOR SELECT TO authenticated, anon USING ((is_published = true));


--
-- Name: feedbacks Users can update their own feedbacks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own feedbacks" ON public.feedbacks FOR UPDATE TO authenticated USING ((auth.uid() = created_by));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

--
-- Name: content_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: feedbacks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

--
-- Name: tutorials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


