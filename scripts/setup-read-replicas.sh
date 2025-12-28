#!/bin/bash
set -e

echo "🗄️  Setting up PostgreSQL Read Replicas"
echo "=========================================="
echo ""

# Check if primary database is running
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "❌ Primary database is not running"
    echo "   Please start it first: docker-compose up -d postgres"
    exit 1
fi

echo "✅ Primary database is running"
echo ""

# Create replication user on primary
echo "👤 Creating replication user..."
docker-compose exec -T postgres psql -U postgres <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'replicator') THEN
            CREATE USER replicator WITH REPLICATION PASSWORD 'replicator_password';
        END IF;
    END
    \$\$;
EOSQL

echo "✅ Replication user created"
echo ""

# Create replication slot
echo "📦 Creating replication slot..."
docker-compose exec -T postgres psql -U postgres <<-EOSQL
    SELECT pg_create_physical_replication_slot('replica_slot_1', true);
EOSQL

echo "✅ Replication slot created"
echo ""

# Start read replicas
echo "🚀 Starting read replicas..."
docker-compose -f docker-compose.replicas.yml up -d

echo ""
echo "⏳ Waiting for replicas to sync..."
sleep 10

# Check replica status
echo ""
echo "📊 Checking replica status..."
docker-compose -f docker-compose.replicas.yml exec -T postgres-replica-1 psql -U postgres -c "SELECT pg_is_in_recovery(), pg_last_wal_replay_lsn();"

echo ""
echo "✅ Read replicas are set up!"
echo ""
echo "📝 Connection strings:"
echo "  Primary (Write): postgresql://postgres:postgres@localhost:5432/blackmoss_herbs"
echo "  Replica 1 (Read): postgresql://postgres:postgres@localhost:5433/blackmoss_herbs"
echo "  PgBouncer Replica: postgresql://postgres:postgres@localhost:6433/blackmoss_herbs"
echo ""
echo "💡 Update your application to use DATABASE_REPLICA_URL for read queries"
