// @ts-nocheck
import { pgTable, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './schema';

// Per-user preferences and settings
export const userSettings = pgTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  timezone: text('timezone').default('UTC'),
  emailNotifications: boolean('email_notifications').default(true),
  weeklyDigest: boolean('weekly_digest').default(true),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

// Tracks important state changes for debugging and compliance
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
});

// Primary expense submission and tracking table
export const expenseReports = pgTable('expense_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  totalAmount: text('total_amount').notNull(),
  status: text('status').default('pending'),
  aiRiskScore: integer('ai_risk_score'),
  submissionDate: timestamp('submission_date').notNull(),
  policyViolations: jsonb('policy_violations').default([]),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// Individual expense line items within reports
export const expenseItems = pgTable('expense_items', {
  id: text('id').primaryKey(),
  expenseReportId: text('expense_report_id').references(() => expenseReports.id, { onDelete: 'cascade' }),
  amount: text('amount').notNull(),
  category: text('category').notNull(),
  vendor: text('vendor').notNull(),
  description: text('description'),
  receiptUrl: text('receipt_url'),
  aiFlag: boolean('ai_flag'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// Configurable expense policies per organization
export const companyPolicies = pgTable('company_policies', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  policyConfig: jsonb('policy_config').notNull(),
  maxSingleExpense: text('max_single_expense'),
  dailyLimit: text('daily_limit'),
  categoryRestrictions: jsonb('category_restrictions').default({}),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
