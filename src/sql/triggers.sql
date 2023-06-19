DROP TRIGGER IF EXISTS event_tags_sort_is_set ON event CASCADE;

DROP FUNCTION IF EXISTS event_tags_sort_is_set () CASCADE;

CREATE FUNCTION event_tags_sort_is_set ()
  RETURNS TRIGGER
  AS $$
BEGIN
  IF (NEW.tags ? 'statistics') THEN
    NEW.tags_sort = 1;
  END IF;
  IF (NEW.tags ? 'monthlyStatistics') THEN
    NEW.tags_sort = 2;
  END IF;
  IF (NEW.tags ? 'victims') THEN
    NEW.tags_sort = 3;
  END IF;
  IF (NEW.tags ? 'highlighted') THEN
    NEW.tags_sort = 4;
  END IF;
  IF (NEW.tags ? 'weather') THEN
    NEW.tags_sort = 5;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER event_tags_sort_is_set
  BEFORE INSERT OR UPDATE ON event
  FOR EACH ROW
  EXECUTE PROCEDURE event_tags_sort_is_set ();

