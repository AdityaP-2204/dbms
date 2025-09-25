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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId UUID REFERENCES users(id)
);

CREATE TABLE response (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message VARCHAR(255) NOT NULL,
    sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId UUID REFERENCES users(id),
    queryId UUID REFERENCES queries(id)
);