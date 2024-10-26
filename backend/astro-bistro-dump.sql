--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13
-- Dumped by pg_dump version 17.0

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
-- Name: astro-bistro; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "astro-bistro" WITH TEMPLATE = template0 ENCODING = 'UTF8'  LOCALE = 'en_US.utf8';


\connect -reuse-previous=on "dbname='astro-bistro'"

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comanda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comanda (
    id integer NOT NULL,
    product_id integer,
    restaurant_id integer,
    quantity integer,
    comments text,
    state integer
);


--
-- Name: comanda_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comanda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comanda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comanda_id_seq OWNED BY public.comanda.id;


--
-- Name: estado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    description character varying(50)
);


--
-- Name: estado_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- Name: menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu (
    id integer NOT NULL,
    restaurante_id integer,
    name character varying(255),
    price numeric(10,2),
    description text
);


--
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_id_seq OWNED BY public.menu.id;


--
-- Name: restaurante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurante (
    id integer NOT NULL,
    name character varying(255),
    lat double precision,
    lon double precision,
    description text
);


--
-- Name: restaurante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurante_id_seq OWNED BY public.restaurante.id;


--
-- Name: comanda id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comanda ALTER COLUMN id SET DEFAULT nextval('public.comanda_id_seq'::regclass);


--
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- Name: menu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu ALTER COLUMN id SET DEFAULT nextval('public.menu_id_seq'::regclass);


--
-- Name: restaurante id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurante ALTER COLUMN id SET DEFAULT nextval('public.restaurante_id_seq'::regclass);


--
-- Data for Name: comanda; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comanda (id, product_id, restaurant_id, quantity, comments, state) FROM stdin;
1	1	1	5	Sin comentarios	2
2	2	1	2	Alérgico al gluten	2
3	3	1	3	Sin sal	2
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.estado (id, description) FROM stdin;
1	Aguardando aceptación
2	Aceptado
3	Rechazado
4	En preparación
5	Listo para ser retirado
6	Pronto a ser servido
\.


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu (id, restaurante_id, name, price, description) FROM stdin;
1	1	Café Latte	4.00	Café con leche suave y espumoso
2	1	Capuccino	4.50	Café con crema de leche espesa y un toque de chocolate
3	1	Muffin de Arándanos	2.50	Muffin dulce con arándanos frescos
4	1	Tostadas con Palta	3.00	Tostadas de pan integral con palta
5	1	Sandwich de Jamón y Queso	3.50	Sándwich de jamón y queso en pan de molde
6	2	Chocolatina	1.50	Chocolatina clásica para un snack rápido
7	2	Papas Fritas	2.00	Papas fritas crujientes en bolsa
8	2	Gaseosa	1.75	Botella de gaseosa de 500ml
9	2	Sándwich de Pollo	3.00	Sándwich rápido de pollo y mayonesa
10	2	Barra de Cereal	1.25	Barra de cereal nutritiva
11	3	Lápiz y Papel	1.00	Combo de lápiz y cuaderno pequeño
12	3	Bolígrafo Azul	0.75	Bolígrafo de tinta azul
13	3	Resaltadores Fluorescentes	3.00	Set de 3 resaltadores de colores
14	3	Cuaderno A4	2.50	Cuaderno tamaño A4 de hojas rayadas
15	3	Libro Universitario	20.00	Libro académico recomendado para estudiantes
16	4	Hamburguesa Clásica	5.50	Hamburguesa con carn
17	4	Papas Fritas con Cheddar	3.00	Papas fritas cubiertas con queso cheddar
18	4	Hot Dog	4.00	Pan con salchich
19	4	Sándwich de Milanesa	6.00	Milanesa de carne con tomate y lechuga en pan
20	4	Wrap Vegetariano	5.00	Wrap relleno de vegetales frescos y hummus
21	5	Copa de Helado de Vainilla	3.00	Copa de helado artesanal de vainilla
22	5	Copa de Helado de Chocolate	3.00	Copa de helado artesanal de chocolate
23	5	Cucurucho Mixto	2.50	Cucurucho con helado de vainilla y chocolate
24	5	Copa de Helado de Frutilla	3.00	Copa de helado artesanal de frutilla
25	5	Sundae con Caramelo	3.50	Helado con caramelo líquido por encima
26	6	Pizza Margherita	7.00	Pizza con salsa de tomat
27	6	Pizza Napolitana	7.50	Pizza con tomat
28	6	Fugazza	6.50	Pizza con cebolla caramelizada y queso
29	6	Empanada de Carne	2.00	Empanada rellena de carne
30	6	Pizza de Pepperoni	8.00	Pizza con salsa de tomat
31	7	Croissant	2.00	Croissant recién horneado con manteca
32	7	Bizcocho Dulce	1.50	Bizcocho de hojaldre con azúcar espolvoreada
33	7	Medialuna de Manteca	2.00	Medialuna tradicional de manteca
34	7	Pastel de Manzana	3.00	Pastel con relleno de manzana y canela
35	7	Sándwich de Miga	2.50	Sándwich suave con jamón y queso
36	8	Espresso	2.50	Café espresso concentrado y aromático
37	8	Café Americano	3.00	Café negro suave estilo americano
38	8	Torta de Chocolate	4.00	Torta de chocolate con crema y trozos de nuez
39	8	Medialuna con Jamón y Queso	3.00	Medialuna rellena de jamón y queso
40	8	Café Mocca	4.50	Café con chocolate y crema
41	9	Medialuna con Jamón y Queso	3.00	Medialuna rellena de jamón y queso
\.


--
-- Data for Name: restaurante; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.restaurante (id, name, lat, lon, description) FROM stdin;
1	Café Universitario	-34.5425	-58.437	Un lugar tranquilo para estudiar, con una excelente variedad de café y snacks.
2	Kiosko Al Paso	-34.5405	-58.4385	Kiosko ideal para comprar cosas rápidas entre clases. Tienen de todo.
3	Librería Universitaria	-34.543	-58.4368	Librería especializada en textos académicos y materiales de estudio.
4	Comida Rápida Gourmet	-34.5427	-58.4362	Deliciosos platos de comida rápida, ideales para llevar entre clases.
5	Heladería Fresca	-34.5434	-58.438	Helados artesanales para disfrutar en un día caluroso.
6	Pizzería Universitaria	-34.5408	-58.4374	Pizzas al paso con los mejores ingredientes.
7	Panadería El Estudiante	-34.542	-58.4358	Pan recién horneado y pasteles ideales para el desayuno.
8	Cafetería Aroma	-34.5435	-58.4365	Cafés especiales y un ambiente acogedor para estudiar.
9	Cafetería del Cero	-34.544299	-58.440439	La mejor cafetería del cero más infinito.
10	El mejor	-34.54587529502023	-58.44698667526246	9 a 12
\.


--
-- Name: comanda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comanda_id_seq', 4, false);


--
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estado_id_seq', 7, false);


--
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_id_seq', 42, false);


--
-- Name: restaurante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurante_id_seq', 11, false);


--
-- Name: comanda comanda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comanda
    ADD CONSTRAINT comanda_pkey PRIMARY KEY (id);


--
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: restaurante restaurante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurante
    ADD CONSTRAINT restaurante_pkey PRIMARY KEY (id);


--
-- Name: menu menu_restaurante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_restaurante_id_fkey FOREIGN KEY (restaurante_id) REFERENCES public.restaurante(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

