CREATE OR REPLACE FUNCTION get_user_growth(timeframe_param TEXT)
RETURNS TABLE (
  date DATE,
  new_users BIGINT
) AS $$
DECLARE
  start_date DATE;
  end_date DATE := CURRENT_DATE;
BEGIN
  -- Set the start date based on the timeframe
  CASE timeframe_param
    WHEN 'day' THEN start_date := end_date - INTERVAL '1 day';
    WHEN 'week' THEN start_date := end_date - INTERVAL '7 days';
    WHEN 'month' THEN start_date := end_date - INTERVAL '30 days';
    ELSE start_date := end_date - INTERVAL '7 days';
  END CASE;
  
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::DATE AS date,
    COUNT(*) AS new_users
  FROM
    user_profiles
  WHERE
    created_at >= start_date AND created_at <= end_date
  GROUP BY
    date_trunc('day', created_at)
  ORDER BY
    date;
END;
$$ LANGUAGE plpgsql;
