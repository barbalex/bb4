CREATE TABLE event(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  datum date DEFAULT NULL,
  title text DEFAULT NULL,
  links jsonb DEFAULT NULL,
  event_type text,
  -- tags is old way of doing this
  -- TODO: check if multipla array elements exist
  -- TODO: import the right one
  tags jsonb DEFAULT NULL,
  tags_sort integer DEFAULT 99,
  tag text DEFAULT NULL
);

-- 1. find tags with multiple elements:
-- select datum, tags, jsonb_array_length(tags) as count from event where jsonb_array_length(tags) > 1;
-- helper queries:
-- select tags from event where tags::jsonb ? 'Italy';
-- select tags - 'Italy' from event where tags::jsonb ? 'Italy';
-- 2. remove superfluos tags:
-- update event set tags = tags - 'Italy';
-- update event set tags = tags - 'Greece';
-- update event set tags = tags - 'Libya';
-- update event set tags = tags - 'statistics' where jsonb_array_length(tags) > 1;
-- 3. update tag column with first (now only) element of tags array
-- UPDATE
--   event
-- SET
--   tag = tags::jsonb ->> 0
-- WHERE
--   tags IS NOT NULL;
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

