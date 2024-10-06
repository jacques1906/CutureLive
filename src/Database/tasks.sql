-- Table: public.tasks

-- DROP TABLE IF EXISTS public.tasks;

CREATE TABLE IF NOT EXISTS public.tasks
(
    task_id integer NOT NULL DEFAULT nextval('tasks_task_id_seq'::regclass),
    customer_id integer NOT NULL,
    rental_id integer NOT NULL,
    send_date timestamp without time zone NOT NULL,
    task_type character varying(10) COLLATE pg_catalog."default" NOT NULL,
    is_sent boolean DEFAULT false,
    CONSTRAINT tasks_pkey PRIMARY KEY (task_id),
    CONSTRAINT tasks_customer_id_fkey FOREIGN KEY (customer_id)
        REFERENCES public.customer (customer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT tasks_rental_id_fkey FOREIGN KEY (rental_id)
        REFERENCES public.rental (rental_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT tasks_task_type_check CHECK (task_type::text = ANY (ARRAY['J-3'::character varying, 'J-5'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tasks
    OWNER to postgres;