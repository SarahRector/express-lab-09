DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients JSONB
);

CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  recipe_id INT NOT NULL,
  date_of_event TEXT NOT NULL,
  notes TEXT,
  rating INT
);
