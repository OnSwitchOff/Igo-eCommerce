import { Logger, QueryRunner } from 'typeorm';

export class QueryCounterLogger implements Logger {
  public queryCount = 0;

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.queryCount++;
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {}
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {}
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {}
  logMigration(message: string, queryRunner?: QueryRunner) {}
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ) {}
}

export const queryLogger = new QueryCounterLogger();
