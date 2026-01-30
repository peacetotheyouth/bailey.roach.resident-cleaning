# Database Configuration Guide

## Overview
This directory contains database connection configuration files for the resident cleaning application.

## Configuration Files

### database.json
Contains environment-specific database connection settings:
- **development**: Local development database settings
- **test**: Test database settings
- **production**: Production database settings using environment variables

## Connection Pool Settings

The configuration includes optimized connection pool settings for improved stability:

### Development/Test
- **max**: 5 connections - Suitable for local development
- **min**: 0 connections - No minimum connections required
- **acquire**: 30000ms - Maximum time to acquire a connection
- **idle**: 10000ms - Maximum time a connection can be idle before being released

### Production
- **max**: 20 connections - Higher limit for production load
- **min**: 5 connections - Maintain a minimum pool of connections
- **acquire**: 60000ms - Longer timeout for production environments
- **idle**: 10000ms - Release idle connections after 10 seconds
- **SSL**: Enabled for secure connections

## Environment Variables

For production deployments, set the following environment variables:

```bash
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=resident_cleaning_prod
DB_USER=your-database-user
DB_PASSWORD=your-secure-password
```

See `.env.example` in the root directory for a complete list of environment variables.

## Database Setup

### PostgreSQL Installation

1. Install PostgreSQL:
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. Create databases:
   ```sql
   CREATE DATABASE resident_cleaning_dev;
   CREATE DATABASE resident_cleaning_test;
   CREATE DATABASE resident_cleaning_prod;
   ```

3. Create user and grant permissions:
   ```sql
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE resident_cleaning_dev TO your_user;
   GRANT ALL PRIVILEGES ON DATABASE resident_cleaning_test TO your_user;
   GRANT ALL PRIVILEGES ON DATABASE resident_cleaning_prod TO your_user;
   ```

## Security Best Practices

1. **Never commit sensitive credentials** - Use environment variables
2. **Enable SSL in production** - Already configured in production settings
3. **Use strong passwords** - Generate secure passwords for database users
4. **Restrict database access** - Limit connections to specific IP addresses
5. **Regular backups** - Implement automated backup solutions

## Troubleshooting

### Connection Issues

If you experience connection problems:

1. Verify PostgreSQL is running:
   ```bash
   sudo service postgresql status
   ```

2. Check database credentials
3. Verify firewall settings allow database connections
4. Check connection pool settings if experiencing timeout issues

### Performance Tuning

If you experience performance issues:

1. Adjust pool sizes based on your application load
2. Monitor connection usage
3. Optimize database queries
4. Consider read replicas for high-traffic applications

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize Connection Pool](https://sequelize.org/docs/v6/other-topics/connection-pool/)
- [Database Security Best Practices](https://www.postgresql.org/docs/current/security.html)
