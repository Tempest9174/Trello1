DROP TABLE IF EXISTS card_labels CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS boards CASCADE;

CREATE TABLE boards (
    id       SERIAL PRIMARY KEY,
    title    VARCHAR(100) NOT NULL,
    position INT          NOT NULL
);

CREATE TABLE lists (
    id       SERIAL PRIMARY KEY,
    board_id INT          NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title    VARCHAR(100) NOT NULL,
    position INT          NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY,
    list_id     INT          NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    due_date    DATE,
    priority    VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    position    INT          NOT NULL
);

CREATE TABLE labels (
    id       SERIAL PRIMARY KEY,
    board_id INT         NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name     VARCHAR(50) NOT NULL,
    color    VARCHAR(7)  NOT NULL
);

CREATE TABLE card_labels (
    card_id  INT NOT NULL REFERENCES cards(id)  ON DELETE CASCADE,
    label_id INT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, label_id)
);
