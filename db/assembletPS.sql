--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-29 19:56:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 213 (class 1259 OID 24576)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    username character varying NOT NULL
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16416)
-- Name: attempt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attempt (
    username character varying NOT NULL,
    puzzleid integer NOT NULL,
    attempts integer,
    timetaken integer,
    solved integer,
    watchedtutorial integer
);


ALTER TABLE public.attempt OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16395)
-- Name: puzzle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puzzle (
    id integer NOT NULL,
    title character varying,
    description character varying,
    tutorialid integer,
    solution character varying,
    instructionsallowed character varying,
    valuesallowed character varying,
    registersallowed character varying,
    category character varying
);


ALTER TABLE public.puzzle OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16402)
-- Name: tutorial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutorial (
    id integer NOT NULL,
    title character varying,
    content character varying
);


ALTER TABLE public.tutorial OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16409)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying NOT NULL,
    password character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3188 (class 2606 OID 24582)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (username);


--
-- TOC entry 3186 (class 2606 OID 16422)
-- Name: attempt attempt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT attempt_pkey PRIMARY KEY (username, puzzleid);


--
-- TOC entry 3180 (class 2606 OID 16401)
-- Name: puzzle puzzle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzle
    ADD CONSTRAINT puzzle_pkey PRIMARY KEY (id);


--
-- TOC entry 3182 (class 2606 OID 16408)
-- Name: tutorial tutorial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutorial
    ADD CONSTRAINT tutorial_pkey PRIMARY KEY (id);


--
-- TOC entry 3184 (class 2606 OID 16415)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


-- Completed on 2022-04-29 19:56:35

--
-- PostgreSQL database dump complete
--

