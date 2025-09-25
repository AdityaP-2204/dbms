CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE faq (
    id UUID PRIMARY KEY,
    Question VARCHAR(500) NOT NULL,
    Answer VARCHAR(500) NOT NULL
);

CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id)
);

CREATE TABLE response (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id),
    query_id UUID REFERENCES queries(id);
);