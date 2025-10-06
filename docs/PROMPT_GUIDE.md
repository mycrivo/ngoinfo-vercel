# Cursor Prompt Guide

## Implement a small feature
- State acceptance criteria
- List files to touch only
- Forbid secrets, keep server-first
- Require tests for services/schemas

## Safe refactor
- Ask Cursor to list plan + affected lines first
- Require post-change import summary to verify tree-shaking

## Contract change
- Update schema file first
- Ask Cursor to fix compile errors across call sites
- Run tests and typecheck before commit


