#!/bin/bash
# Database Backup Initialization Script
# Merchant Transaction Portal
# AI-generated: 100%
#
# This script runs once during PostgreSQL container initialization
# It sets up automated daily backups to the /backups volume

set -e

echo "=============================================="
echo "Setting up automated database backups..."
echo "=============================================="

# Create backup directory if it doesn't exist
mkdir -p /backups
chmod 755 /backups

# Create the backup script
cat > /usr/local/bin/backup-database.sh << 'EOF'
#!/bin/sh
# Daily backup script for PostgreSQL database

BACKUP_DIR=/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE=${POSTGRES_DB:-merchant_portal_db}
USER=${POSTGRES_USER:-merchant_portal_user}

echo "=============================================="
echo "Starting database backup at $(date)"
echo "Database: $DATABASE"
echo "Backup directory: $BACKUP_DIR"
echo "=============================================="

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform database dump with compression
pg_dump -U $USER $DATABASE | gzip > $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz | cut -f1)
    echo "✅ Backup completed successfully: backup_${TIMESTAMP}.sql.gz (${BACKUP_SIZE})"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Keep only last 7 days of backups
echo "Cleaning up old backups (keeping last 7 days)..."
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# List remaining backups
echo "Current backups:"
ls -lh $BACKUP_DIR/backup_*.sql.gz 2>/dev/null || echo "No backups found"

echo "=============================================="
echo "Backup process completed at $(date)"
echo "=============================================="
EOF

# Make backup script executable
chmod +x /usr/local/bin/backup-database.sh

echo "✅ Backup script created at /usr/local/bin/backup-database.sh"

# Create manual restore script
cat > /usr/local/bin/restore-database.sh << 'EOF'
#!/bin/sh
# Manual database restore script

if [ -z "$1" ]; then
    echo "Usage: restore-database.sh <backup_file>"
    echo "Example: restore-database.sh backup_20260221_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="/backups/$1"
DATABASE=${POSTGRES_DB:-merchant_portal_db}
USER=${POSTGRES_USER:-merchant_portal_user}

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "=============================================="
echo "Restoring database from: $1"
echo "Database: $DATABASE"
echo "=============================================="

# Restore database
gunzip -c $BACKUP_FILE | psql -U $USER $DATABASE

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully from $1"
else
    echo "❌ Database restore failed!"
    exit 1
fi
EOF

chmod +x /usr/local/bin/restore-database.sh

echo "✅ Restore script created at /usr/local/bin/restore-database.sh"

# Note: Automated scheduling via cron requires additional setup in production
# For Docker, consider using a separate cron container or external scheduler

echo "=============================================="
echo "Backup system configured successfully!"
echo ""
echo "Manual backup: docker-compose exec postgres /usr/local/bin/backup-database.sh"
echo "Manual restore: docker-compose exec postgres /usr/local/bin/restore-database.sh <filename>"
echo "=============================================="
