# Redis Learning Notes

This repository contains my Redis learning notes and sample code.

## Goals

- Build a working mental model of Redis core data structures.
- Practice common commands and patterns.
- Keep short, useful examples alongside notes.

## Repository Contents

- Notes: this README and any future markdown files in the repo.
- Code: small, focused examples for each topic (to be added).

## Learning Plan (Roadmap)

1. Basics
	- What Redis is and when to use it.
	- Installation and running a local server.
	- Redis CLI basics.
2. Core Data Types
	- Strings
	- Lists
	- Sets
	- Hashes
	- Sorted Sets
3. Key Topics
	- Expiration and TTL
	- Pub/Sub
	- Transactions
	- Pipelines
	- Persistence (RDB, AOF)
4. Patterns
	- Caching
	- Rate limiting
	- Queues
	- Leaderboards
5. Operations
	- Memory policies
	- Monitoring
	- Backups

## Notes (Quick Start)

### What is Redis?

Redis is an in-memory key-value data store that is fast, simple, and
commonly used for caching, queues, session storage, and real-time
analytics.

### Core Concepts

- Keys are binary-safe strings.
- Values use typed data structures (string, list, set, hash, zset).
- Commands are atomic by default.
- Data can be persisted to disk (RDB snapshot, AOF log).

### Getting Started (Commands)

```text
PING
SET user:1 "Ada"
GET user:1
EXPIRE user:1 60
TTL user:1
DEL user:1
```

## Code Examples

Add example files here as you progress. Suggested structure:

```
examples/
  strings.md
  lists.md
  sets.md
  hashes.md
  sorted-sets.md
  pubsub.md
  transactions.md
```

## Next Steps

- Add a notes file per data type.
- Add a small script or CLI snippet per topic.

