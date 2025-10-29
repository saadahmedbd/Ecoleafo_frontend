// src/app/hooks.js

import { useDispatch, useSelector } from 'react-redux';

/**
 * Custom Redux Hooks
 * Pre-typed versions of useDispatch and useSelector
 * 
 * Benefits:
 * - Type safety (when migrating to TypeScript)
 * - Consistent usage across the app
 * - Easy to add custom logic if needed
 */

/**
 * Use throughout app instead of plain `useDispatch`
 * Provides correct types for dispatch
 */
export const useAppDispatch = () => useDispatch();

/**
 * Use throughout app instead of plain `useSelector`
 * Provides correct types for state
 */
export const useAppSelector = useSelector;

// Export for convenience
export { useDispatch, useSelector };