# Gator

Blog aggregator CLI for tracking and browsing RSS feeds.

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- PostgreSQL database

## Installation

```bash
npm install
```

## Configuration

Create `~/.gatorconfig.json`:

```json
{
  "db_url": "postgresql://user:password@localhost:5432/gator",
  "current_user_name": "your_username"
}
```

## Database Setup

Run migrations:

```bash
npm run migrate
```

## Usage

```bash
npm start <command> [args...]
```

## Commands

### User Management

- `register <name>` - Create a new user
- `login <name>` - Set the current user
- `users` - List all users
- `reset` - Reset the database

### Feed Management

- `feeds` - List all feeds
- `addfeed <name> <url>` - Add a new RSS feed
- `follow <url>` - Follow a feed
- `unfollow <url>` - Unfollow a feed
- `following` - List feeds you're following

### Browse Posts

- `browse [limit]` - View posts from followed feeds (default limit: 2)
- `agg <interval>` - Start aggregating feeds at specified interval (e.g., `1m`, `30s`, `1h`)

## Example Workflow

```bash
# Register and login
npm start register alice
npm start login alice

# Add and follow feeds
npm start addfeed "Tech Blog" https://example.com/feed.xml
npm start follow https://example.com/feed.xml

# Start aggregator in background
npm start agg 5m

# Browse posts
npm start browse 10
```
