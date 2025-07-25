CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    winnerId UUID,
    createdAt TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (winnerId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gamePlayers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gameId UUID NOT NULL,
    playerId UUID NOT NULL,
    isWinner BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (playerId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (gameId, playerId)
);
