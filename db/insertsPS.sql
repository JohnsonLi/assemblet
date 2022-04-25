--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-25 10:27:39

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

--
-- TOC entry 3325 (class 0 OID 16416)
-- Dependencies: 212
-- Data for Name: attempt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attempt (username, puzzleid, attempts, timetaken, solved, watchedtutorial) FROM stdin;
\.


--
-- TOC entry 3322 (class 0 OID 16395)
-- Dependencies: 209
-- Data for Name: puzzle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puzzle (id, title, description, tutorialid, solution, instructionsallowed, valuesallowed, registersallowed) FROM stdin;
3	Fibonacci	Create a program to output the first n amount of letters of the Fibonacci sequence.\\r\\nN can be retrieved from register X.\\r\\n\\r\\nExamples:\\r\\nn = 1, Output = 0\\r\\nn = 5, Output = 0, 1, 1, 2, 3	\N	-1	move, add, jne	-1	a, b, c, d, e, f, g
\.


--
-- TOC entry 3323 (class 0 OID 16402)
-- Dependencies: 210
-- Data for Name: tutorial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tutorial (id, title, content) FROM stdin;
0	Welcome to Assemblet!	First, let's try moving a value into a register. To do this, use the move instruction. <br><br> <span class="code">move 5 a</span> <br><br> After you have your desired value, submit the value in the out instruction. <br><br> <span class="code">out a</span>
\.


--
-- TOC entry 3324 (class 0 OID 16409)
-- Dependencies: 211
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, password) FROM stdin;
\.


-- Completed on 2022-04-25 10:27:39

--
-- PostgreSQL database dump complete
--

