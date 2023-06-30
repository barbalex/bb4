DROP TRIGGER IF EXISTS event_tags_sort_is_set ON event CASCADE;

DROP FUNCTION IF EXISTS event_tags_sort_is_set() CASCADE;

CREATE OR REPLACE FUNCTION event_tags_sort_is_set()
  RETURNS TRIGGER
  AS $$
BEGIN
  IF(NEW.tag = 'statistics') THEN
    NEW.tags_sort = 1;
    ELSEIF(NEW.tags ? 'statistics') THEN
    NEW.tags_sort = 1;
    NEW.tag = 'statistics';
  END IF;
  IF(NEW.tag = 'monthlyStatistics') THEN
    NEW.tags_sort = 2;
    ELSEIF(NEW.tags ? 'monthlyStatistics') THEN
    NEW.tags_sort = 2;
    NEW.tag = 'monthlyStatistics';
  END IF;
  IF(NEW.tag = 'victims') THEN
    NEW.tags_sort = 3;
    ELSEIF(NEW.tags ? 'victims') THEN
    NEW.tags_sort = 3;
    NEW.tag = 'victims';
  END IF;
  IF(NEW.tag = 'highlighted') THEN
    NEW.tags_sort = 4;
    ELSEIF(NEW.tags ? 'highlighted') THEN
    NEW.tags_sort = 4;
    NEW.tag = 'highlighted';
  END IF;
  IF(NEW.tag = 'weather') THEN
    NEW.tags_sort = 5;
    ELSEIF(NEW.tags ? 'weather') THEN
    NEW.tags_sort = 5;
    NEW.tag = 'weather';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER event_tags_sort_is_set
  BEFORE INSERT OR UPDATE ON event
  FOR EACH ROW
  EXECUTE PROCEDURE event_tags_sort_is_set();

