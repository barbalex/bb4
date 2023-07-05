CREATE TABLE event(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  datum date DEFAULT NULL,
  title text DEFAULT NULL,
  links jsonb DEFAULT NULL,
  event_type text,
  tag text DEFAULT NULL,
  tags_sort integer DEFAULT 99
);

CREATE INDEX ON event USING btree(id);

CREATE INDEX ON event USING btree(datum);

CREATE INDEX ON event USING btree(title);

CREATE INDEX ON event USING btree(tags_sort);

-- was: commentary
CREATE TABLE article(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  datum date DEFAULT NULL,
  title text DEFAULT NULL,
  content bytea DEFAULT NULL, -- was: article
  draft boolean DEFAULT TRUE
);

-- ALTER TABLE article
--   ADD COLUMN draft boolean DEFAULT TRUE;
-- ALTER TABLE article
--   ALTER COLUMN draft SET DEFAULT FALSE;
CREATE INDEX ON article USING btree(id);

CREATE INDEX ON article USING btree(datum);

CREATE INDEX ON article USING btree(title);

CREATE TABLE page(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT NULL,
  content bytea DEFAULT NULL -- was: article
);

CREATE INDEX ON page USING btree(id);

CREATE INDEX ON page USING btree(name);

CREATE TABLE publication(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT NULL,
  category text DEFAULT NULL,
  sort integer DEFAULT NULL, -- was: order
  content bytea DEFAULT NULL -- was: article
  draft boolean DEFAULT TRUE
);

CREATE INDEX ON publication USING btree(id);

CREATE INDEX ON publication USING btree(sort);

