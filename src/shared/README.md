# Shared Components and Utilities

This directory contains reusable components, utilities, and types that are shared across the application.

## Structure

- `components/` - Reusable UI components
- `utils/` - Utility functions and helpers
- `types/` - Shared TypeScript type definitions
- `constants/` - Application-wide constants

## Usage

Import shared resources using the `@/shared/*` path alias:

```typescript
import { Button } from "@/shared/components/Button";
import { formatDate } from "@/shared/utils/date";
```
