/**
 * useKeyboardShortcut Hook
 * Handle keyboard shortcuts
 * AI-generated: 100%
 */

import { useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard shortcuts
 *
 * @param {string|string[]} keys - Key or array of keys (e.g., 'Escape', ['ctrl', 'k'])
 * @param {Function} callback - Function to call when shortcut is triggered
 * @param {Object} options - Options (enabled, preventDefault, etc.)
 *
 * @example
 * useKeyboardShortcut('Escape', () => closeModal());
 * useKeyboardShortcut(['ctrl', 'k'], () => openCommandPalette(), { preventDefault: true });
 * useKeyboardShortcut('/', () => focusSearch(), { preventDefault: true });
 */
export function useKeyboardShortcut(keys, callback, options = {}) {
  const {
    enabled = true,
    preventDefault = false,
    target = typeof window !== 'undefined' ? window : null
  } = options;

  const handleKeyPress = useCallback((event) => {
    if (!enabled) return;

    // Convert keys to array if it's a single key
    const keyArray = Array.isArray(keys) ? keys : [keys];

    // Check if this is a modifier combination (e.g., ['ctrl', 'k'])
    if (keyArray.length > 1) {
      const modifiers = keyArray.slice(0, -1);
      const mainKey = keyArray[keyArray.length - 1].toLowerCase();

      const modifiersPressed = modifiers.every(modifier => {
        switch (modifier.toLowerCase()) {
          case 'ctrl':
          case 'control':
            return event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
          case 'shift':
            return event.shiftKey;
          case 'alt':
          case 'option':
            return event.altKey;
          case 'meta':
          case 'cmd':
          case 'command':
            return event.metaKey;
          default:
            return false;
        }
      });

      if (modifiersPressed && event.key.toLowerCase() === mainKey) {
        if (preventDefault) event.preventDefault();
        callback(event);
      }
    } else {
      // Single key shortcut
      const key = keyArray[0];

      if (event.key === key || event.key.toLowerCase() === key.toLowerCase()) {
        // Don't trigger if user is typing in an input
        const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          event.target.tagName
        );

        if (!isTyping) {
          if (preventDefault) event.preventDefault();
          callback(event);
        }
      }
    }
  }, [keys, callback, enabled, preventDefault]);

  useEffect(() => {
    if (!target || !enabled) return;

    target.addEventListener('keydown', handleKeyPress);

    return () => {
      target.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, target, enabled]);
}

/**
 * Predefined common shortcuts
 */
export function useEscapeKey(callback, enabled = true) {
  useKeyboardShortcut('Escape', callback, { enabled });
}

export function useEnterKey(callback, enabled = true) {
  useKeyboardShortcut('Enter', callback, { enabled });
}

export function useCommandK(callback, enabled = true) {
  useKeyboardShortcut(['ctrl', 'k'], callback, { enabled, preventDefault: true });
}

export function useSearchShortcut(callback, enabled = true) {
  useKeyboardShortcut('/', callback, { enabled, preventDefault: true });
}

export default useKeyboardShortcut;
