-- psql -U postgres -d brushnbidDB

CREATE TYPE public.tipo_obra AS ENUM (
    'escultura',
    'pintura',
    'fotografia',
    'otras'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.artists (
    id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    rol character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    wallet double precision DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.artists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.artists_id_seq OWNED BY public.artists.id;

CREATE TABLE public.obras (
    id integer NOT NULL,
    titulo text NOT NULL,
    autoria_id integer NOT NULL,
    propiedad_id integer NOT NULL,
    tipo public.tipo_obra NOT NULL,
    descripcion text,
    imagen bytea
);

CREATE SEQUENCE public.obras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.obras_id_seq OWNED BY public.obras.id;

CREATE TABLE public.pujas (
    id integer NOT NULL,
    subasta_id integer NOT NULL,
    user_id integer NOT NULL,
    cantidad numeric(12,2) NOT NULL,
    fecha timestamp without time zone DEFAULT now()
);

CREATE SEQUENCE public.pujas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.pujas_id_seq OWNED BY public.pujas.id;

CREATE TABLE public.subastas (
    id integer NOT NULL,
    obra_id integer NOT NULL,
    vendedor_id integer NOT NULL,
    precio_inicial numeric(12,2) DEFAULT 0 NOT NULL,
    incremento numeric(12,2) DEFAULT 0 NOT NULL,
    precio_reserva numeric(12,2) DEFAULT 0 NOT NULL,
    fecha_inicio timestamp without time zone DEFAULT now() NOT NULL,
    duracion interval,
    fecha_fin timestamp without time zone GENERATED ALWAYS AS ((fecha_inicio + duracion)) STORED,
    adjudicado boolean DEFAULT false
);

CREATE SEQUENCE public.subastas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.subastas_id_seq OWNED BY public.subastas.id;

ALTER TABLE ONLY public.artists ALTER COLUMN id SET DEFAULT nextval('public.artists_id_seq'::regclass);

ALTER TABLE ONLY public.obras ALTER COLUMN id SET DEFAULT nextval('public.obras_id_seq'::regclass);

ALTER TABLE ONLY public.pujas ALTER COLUMN id SET DEFAULT nextval('public.pujas_id_seq'::regclass);

ALTER TABLE ONLY public.subastas ALTER COLUMN id SET DEFAULT nextval('public.subastas_id_seq'::regclass);


INSERT INTO artists VALUES (2, 'Francisco Raúl C.S.', 'currogamez', 'USER', 'currogamez@gmail.com', '$2a$10$nqmIE1VVNn4MKKajwlfAsOgxhfoIRrbGreKEdkZZ2SpgQZUFJU8RC', 685, '2024-10-25 17:37:46.611255');
INSERT INTO artists VALUES (1, 'Marina J. Carranza Sánchez', 'mjcs163', 'ADMIN', 'mjcs@gmail.com', '$2a$10$V8v4rCrt5fb47.gxhoxoK.P0oesxviKbcXD2C5oEE2OvnEwW5PENO', 530, '2024-10-25 17:37:46.611255');

INSERT INTO obras VALUES 
(1, 'El amanecer', 2, 2, 'pintura', 'Óleo sobre lienzo, 30x40cm', NULL),
(2, 'Tótem de Madera', 1, 2, 'escultura', 'Madera de cedro barnizada, 21x36x10.', NULL);

INSERT INTO subastas VALUES (1, 2, 1, 20.00, 0.00, 0.00, '2024-11-15 17:32:42.325', NULL, DEFAULT, true);

INSERT INTO pujas VALUES (1, 1, 2, 25.00, '2024-11-21 17:02:51.942945');
INSERT INTO pujas VALUES (2, 1, 1, 27.00, '2024-11-21 17:07:16.916568');
INSERT INTO pujas VALUES (3, 1, 1, 30.00, '2024-11-21 17:32:27.733626');
INSERT INTO pujas VALUES (4, 1, 2, 35.00, '2024-11-21 17:39:38.524566');
INSERT INTO pujas VALUES (5, 1, 1, 40.00, '2024-11-21 17:47:05.424123');
INSERT INTO pujas VALUES (6, 1, 2, 50.00, '2024-11-21 17:58:41.925669');