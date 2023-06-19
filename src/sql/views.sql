DROP VIEW IF EXISTS v_event_years CASCADE;

CREATE OR REPLACE VIEW v_event_years AS
SELECT
  -- wanted to only send id but weirdly it does not group correctly then :-(
  to_char(date_trunc('year', datum), 'yyyy')::int AS id, -- need id for apollo
  to_char(date_trunc('year', datum), 'yyyy')::int AS year
FROM
  EVENT
GROUP BY
  year
ORDER BY
  year ASC;

DROP VIEW IF EXISTS v_publication_categories CASCADE;

