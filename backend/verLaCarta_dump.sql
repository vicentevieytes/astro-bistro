--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-10-28 00:31:15

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
-- TOC entry 4912 (class 1262 OID 16405)
-- Name: verLaCarta; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "verLaCarta" WITH TEMPLATE = template0 ENCODING = 'UTF8'  LOCALE = 'Portuguese_Brazil.1252';


\connect "verLaCarta"

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

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16427)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_items (
    item_id integer NOT NULL,
    restaurant_id integer,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 219 (class 1259 OID 16426)
-- Name: menuitems_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menuitems_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 219
-- Name: menuitems_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menuitems_item_id_seq OWNED BY public.menu_items.item_id;


--
-- TOC entry 228 (class 1259 OID 16492)
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    order_item_id integer NOT NULL,
    order_id integer,
    item_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 226 (class 1259 OID 16474)
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_status_history (
    history_id integer NOT NULL,
    order_id integer,
    status_id integer,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 222 (class 1259 OID 16442)
-- Name: order_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_statuses (
    status_id integer NOT NULL,
    status_name character varying(50) NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 16491)
-- Name: orderitems_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orderitems_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 227
-- Name: orderitems_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orderitems_order_item_id_seq OWNED BY public.order_items.order_item_id;


--
-- TOC entry 224 (class 1259 OID 16451)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    restaurant_id integer,
    status_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 223 (class 1259 OID 16450)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 221 (class 1259 OID 16441)
-- Name: orderstatuses_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orderstatuses_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 221
-- Name: orderstatuses_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orderstatuses_status_id_seq OWNED BY public.order_statuses.status_id;


--
-- TOC entry 225 (class 1259 OID 16473)
-- Name: orderstatushistory_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orderstatushistory_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 225
-- Name: orderstatushistory_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orderstatushistory_history_id_seq OWNED BY public.order_status_history.history_id;


--
-- TOC entry 218 (class 1259 OID 16417)
-- Name: restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurants (
    restaurant_id integer NOT NULL nextval(10) PRIMARY KEY,
    restaurant_name character varying(100) NOT NULL,
    description text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    logo bytea,
    image0 bytea,
    image1 bytea,
    image2 bytea,
    image3 bytea,
    image4 bytea,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 217 (class 1259 OID 16416)
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurants_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 217
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurants_restaurant_id_seq OWNED BY public.restaurants.restaurant_id;


--
-- TOC entry 216 (class 1259 OID 16407)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 215 (class 1259 OID 16406)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4715 (class 2604 OID 16430)
-- Name: menu_items item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN item_id SET DEFAULT nextval('public.menuitems_item_id_seq'::regclass);


--
-- TOC entry 4722 (class 2604 OID 16495)
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.orderitems_order_item_id_seq'::regclass);


--
-- TOC entry 4720 (class 2604 OID 16477)
-- Name: order_status_history history_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history ALTER COLUMN history_id SET DEFAULT nextval('public.orderstatushistory_history_id_seq'::regclass);


--
-- TOC entry 4717 (class 2604 OID 16445)
-- Name: order_statuses status_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_statuses ALTER COLUMN status_id SET DEFAULT nextval('public.orderstatuses_status_id_seq'::regclass);


--
-- TOC entry 4718 (class 2604 OID 16454)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4713 (class 2604 OID 16420)
-- Name: restaurants restaurant_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN restaurant_id SET DEFAULT nextval('public.restaurants_restaurant_id_seq'::regclass);


--
-- TOC entry 4711 (class 2604 OID 16410)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4898 (class 0 OID 16427)
-- Dependencies: 220
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu_items (item_id, restaurant_id, name, description, price, created_at) FROM stdin;
1	1	Café Latte	Café con leche suave y espumoso	4.00	2024-10-26 20:05:59.608609-03
2	1	Capuccino	Café con crema de leche espesa y un toque de chocolate	4.50	2024-10-26 20:05:59.608609-03
3	1	Muffin de Arándanos	Muffin dulce con arándanos frescos	2.50	2024-10-26 20:05:59.608609-03
4	1	Tostadas con Palta	Tostadas de pan integral con palta	3.00	2024-10-26 20:05:59.608609-03
5	1	Sandwich de Jamón y Queso	Sándwich de jamón y queso en pan de molde	3.50	2024-10-26 20:05:59.608609-03
6	2	Chocolatina	Chocolatina clásica para un snack rápido	1.50	2024-10-26 20:05:59.608609-03
7	2	Papas Fritas	Papas fritas crujientes en bolsa	2.00	2024-10-26 20:05:59.608609-03
8	2	Gaseosa	Botella de gaseosa de 500ml	1.75	2024-10-26 20:05:59.608609-03
9	2	Sándwich de Pollo	Sándwich rápido de pollo y mayonesa	3.00	2024-10-26 20:05:59.608609-03
10	2	Barra de Cereal	Barra de cereal nutritiva	1.25	2024-10-26 20:05:59.608609-03
11	3	Lápiz y Papel	Combo de lápiz y cuaderno pequeño	1.00	2024-10-26 20:05:59.608609-03
12	3	Bolígrafo Azul	Bolígrafo de tinta azul	0.75	2024-10-26 20:05:59.608609-03
13	3	Resaltadores Fluorescentes	Set de 3 resaltadores de colores	3.00	2024-10-26 20:05:59.608609-03
14	3	Cuaderno A4	Cuaderno tamaño A4 de hojas rayadas	2.50	2024-10-26 20:05:59.608609-03
15	3	Libro Universitario	Libro académico recomendado para estudiantes	20.00	2024-10-26 20:05:59.608609-03
16	4	Hamburguesa Clásica	Hamburguesa con carne	5.50	2024-10-26 20:05:59.608609-03
17	4	Papas Fritas con Cheddar	Papas fritas cubiertas con queso cheddar	3.00	2024-10-26 20:05:59.608609-03
18	4	Hot Dog	Pan con salchicha	4.00	2024-10-26 20:05:59.608609-03
19	4	Sándwich de Milanesa	Milanesa de carne con tomate y lechuga en pan	6.00	2024-10-26 20:05:59.608609-03
20	4	Wrap Vegetariano	Wrap relleno de vegetales frescos y hummus	5.00	2024-10-26 20:05:59.608609-03
21	5	Copa de Helado de Vainilla	Copa de helado artesanal de vainilla	3.00	2024-10-26 20:05:59.608609-03
22	5	Copa de Helado de Chocolate	Copa de helado artesanal de chocolate	3.00	2024-10-26 20:05:59.608609-03
23	5	Cucurucho Mixto	Cucurucho con helado de vainilla y chocolate	2.50	2024-10-26 20:05:59.608609-03
24	5	Copa de Helado de Frutilla	Copa de helado artesanal de frutilla	3.00	2024-10-26 20:05:59.608609-03
25	5	Sundae con Caramelo	Helado con caramelo líquido por encima	3.50	2024-10-26 20:05:59.608609-03
26	6	Pizza Margherita	Pizza con salsa de tomate	7.00	2024-10-26 20:05:59.608609-03
27	6	Pizza Napolitana	Pizza con tomate	7.50	2024-10-26 20:05:59.608609-03
28	6	Fugazza	Pizza con cebolla caramelizada y queso	6.50	2024-10-26 20:05:59.608609-03
29	6	Empanada de Carne	Empanada rellena de carne	2.00	2024-10-26 20:05:59.608609-03
30	6	Pizza de Pepperoni	Pizza con salsa de tomate	8.00	2024-10-26 20:05:59.608609-03
31	7	Croissant	Croissant recién horneado con manteca	2.00	2024-10-26 20:05:59.608609-03
32	7	Bizcocho Dulce	Bizcocho de hojaldre con azúcar espolvoreada	1.50	2024-10-26 20:05:59.608609-03
33	7	Medialuna de Manteca	Medialuna tradicional de manteca	2.00	2024-10-26 20:05:59.608609-03
34	7	Pastel de Manzana	Pastel con relleno de manzana y canela	3.00	2024-10-26 20:05:59.608609-03
35	7	Sándwich de Miga	Sándwich suave con jamón y queso	2.50	2024-10-26 20:05:59.608609-03
36	8	Espresso	Café espresso concentrado y aromático	2.50	2024-10-26 20:05:59.608609-03
37	8	Café Americano	Café negro suave estilo americano	3.00	2024-10-26 20:05:59.608609-03
38	8	Torta de Chocolate	Torta de chocolate con crema y trozos de nuez	4.00	2024-10-26 20:05:59.608609-03
39	8	Medialuna con Jamón y Queso	Medialuna rellena de jamón y queso	3.00	2024-10-26 20:05:59.608609-03
40	8	Café Mocca	Café con chocolate y crema	4.50	2024-10-26 20:05:59.608609-03
41	9	Medialuna con Jamón y Queso	Medialuna rellena de jamón y queso	3.00	2024-10-26 20:05:59.608609-03
\.


--
-- TOC entry 4906 (class 0 OID 16492)
-- Dependencies: 228
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (order_item_id, order_id, item_id, quantity, price, created_at) FROM stdin;
55	18	31	1	2.00	2024-10-27 04:28:31.895-03
56	19	35	3	2.50	2024-10-27 04:29:47.327-03
57	20	31	3	2.00	2024-10-27 04:31:02.913-03
58	21	32	32	1.50	2024-10-27 04:44:21.868-03
59	22	35	1	2.50	2024-10-27 04:51:40.174-03
60	23	41	1	3.00	2024-10-27 04:51:55.112-03
61	24	38	4	4.00	2024-10-27 04:55:27.659-03
\.


--
-- TOC entry 4904 (class 0 OID 16474)
-- Dependencies: 226
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_status_history (history_id, order_id, status_id, changed_at) FROM stdin;
\.


--
-- TOC entry 4900 (class 0 OID 16442)
-- Dependencies: 222
-- Data for Name: order_statuses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_statuses (status_id, status_name) FROM stdin;
1	Aguardando aceptación
2	Aceptado
3	Rechazado
4	En preparación
5	Listo para ser retirado
6	Pronto a ser servido
\.


--
-- TOC entry 4902 (class 0 OID 16451)
-- Dependencies: 224
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (order_id, user_id, restaurant_id, status_id, created_at) FROM stdin;
20	1	7	2	2024-10-27 04:31:02.872-03
19	1	7	2	2024-10-27 04:29:47.315-03
18	1	7	2	2024-10-27 04:28:31.888-03
21	1	7	4	2024-10-27 04:44:21.828-03
22	1	7	1	2024-10-27 04:51:40.13-03
23	1	9	3	2024-10-27 04:51:55.072-03
24	1	8	1	2024-10-27 04:55:27.612-03
\.


--
-- TOC entry 4896 (class 0 OID 16417)
-- Dependencies: 218
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.restaurants (restaurant_id, restaurant_name, description, latitude, longitude, created_at) FROM stdin;
1	Café Universitario	Un lugar tranquilo para estudiar, con una excelente variedad de café y snacks.	-34.54250000	-58.43700000	2024-10-26 20:03:30.707734-03
2	Kiosko Al Paso	Kiosko ideal para comprar cosas rápidas entre clases. Tienen de todo.	-34.54050000	-58.43850000	2024-10-26 20:03:30.707734-03
3	Librería Universitaria	Librería especializada en textos académicos y materiales de estudio.	-34.54300000	-58.43680000	2024-10-26 20:03:30.707734-03
4	Comida Rápida Gourmet	Deliciosos platos de comida rápida, ideales para llevar entre clases.	-34.54270000	-58.43620000	2024-10-26 20:03:30.707734-03
5	Heladería Fresca	Helados artesanales para disfrutar en un día caluroso.	-34.54340000	-58.43800000	2024-10-26 20:03:30.707734-03
6	Pizzería Universitaria	Pizzas al paso con los mejores ingredientes.	-34.54080000	-58.43740000	2024-10-26 20:03:30.707734-03
7	Panadería El Estudiante	Pan recién horneado y pasteles ideales para el desayuno.	-34.54200000	-58.43580000	2024-10-26 20:03:30.707734-03
8	Cafetería Aroma	Cafés especiales y un ambiente acogedor para estudiar.	-34.54350000	-58.43650000	2024-10-26 20:03:30.707734-03
9	Cafetería del Cero	La mejor cafetería del cero más infinito.	-34.54429900	-58.44043900	2024-10-26 20:03:30.707734-03
\.


--
-- TOC entry 4894 (class 0 OID 16407)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, username, created_at) FROM stdin;
1	Pepe	2024-10-26 20:24:31.2386-03
\.


--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 219
-- Name: menuitems_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menuitems_item_id_seq', 41, true);


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 227
-- Name: orderitems_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orderitems_order_item_id_seq', 61, true);


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 24, true);


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 221
-- Name: orderstatuses_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orderstatuses_status_id_seq', 6, true);


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 225
-- Name: orderstatushistory_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orderstatushistory_history_id_seq', 1, false);


--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 217
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurants_restaurant_id_seq', 1, false);


--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


--
-- TOC entry 4731 (class 2606 OID 16435)
-- Name: menu_items menuitems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menuitems_pkey PRIMARY KEY (item_id);


--
-- TOC entry 4741 (class 2606 OID 16498)
-- Name: order_items orderitems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT orderitems_pkey PRIMARY KEY (order_item_id);


--
-- TOC entry 4737 (class 2606 OID 16457)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4733 (class 2606 OID 16447)
-- Name: order_statuses orderstatuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_statuses
    ADD CONSTRAINT orderstatuses_pkey PRIMARY KEY (status_id);


--
-- TOC entry 4735 (class 2606 OID 16449)
-- Name: order_statuses orderstatuses_status_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_statuses
    ADD CONSTRAINT orderstatuses_status_name_key UNIQUE (status_name);


--
-- TOC entry 4739 (class 2606 OID 16480)
-- Name: order_status_history orderstatushistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT orderstatushistory_pkey PRIMARY KEY (history_id);


--
-- TOC entry 4729 (class 2606 OID 16425)
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id);


--
-- TOC entry 4725 (class 2606 OID 16413)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4727 (class 2606 OID 16415)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4742 (class 2606 OID 16436)
-- Name: menu_items menuitems_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menuitems_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(restaurant_id);


--
-- TOC entry 4748 (class 2606 OID 16504)
-- Name: order_items orderitems_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT orderitems_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.menu_items(item_id);


--
-- TOC entry 4749 (class 2606 OID 16499)
-- Name: order_items orderitems_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT orderitems_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4743 (class 2606 OID 16463)
-- Name: orders orders_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(restaurant_id);


--
-- TOC entry 4744 (class 2606 OID 16468)
-- Name: orders orders_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.order_statuses(status_id);


--
-- TOC entry 4745 (class 2606 OID 16458)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4746 (class 2606 OID 16481)
-- Name: order_status_history orderstatushistory_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT orderstatushistory_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4747 (class 2606 OID 16486)
-- Name: order_status_history orderstatushistory_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT orderstatushistory_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.order_statuses(status_id);


-- Completed on 2024-10-28 00:31:16

--
-- PostgreSQL database dump complete
--

