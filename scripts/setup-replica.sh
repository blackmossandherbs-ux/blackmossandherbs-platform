#!/bin/bash
set -e

echo "Setting up PostgreSQL read replica..."

# Wait for primary database
until pg_isready -h "$POSTGRES_MASTER_SERVICE_HOST" -p "$POSTGRES_MASTER_SERVICE_PORT" -U postgres; do
    echo "Waiting for primary database..."
    sleep 2
done

# Create replication slot on primary (if not exists)
psql -h "$POSTGRES_MASTER_SERVICE_HOST" -p "$POSTGRES_MASTER_SERVICE_PORT" -U postgres -d postgres <<-EOSQL
    SELECT pg_create_physical_replication_slot('replica_slot_1', true);
EOSQL

# Perform base backup
pg_basebackup \
    -h "$POSTGRES_MASTER_SERVICE_HOST" \
    -p "$POSTGRES_MASTER_SERVICE_PORT" \
    -U "$POSTGRES_REPLICATION_USER" \
    -D /var/lib/postgresql/data \
    -Fp \
    -Xs \
    -P \
    -R \
    -S replica_slot_1

# Configure recovery
cat >> /var/lib/postgresql/data/postgresql.conf <<EOF
primary_conninfo = 'host=$POSTGRES_MASTER_SERVICE_HOST port=$POSTGRES_MASTER_SERVICE_PORT user=$POSTGRES_REPLICATION_USER password=$POSTGRES_REPLICATION_PASSWORD'
primary_slot_name = 'replica_slot_1'
hot_standby = on
hot_standby_feedback = on
EOF

echo "Read replica setup complete!"
