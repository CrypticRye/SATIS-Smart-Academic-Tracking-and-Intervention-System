import toast from 'react-hot-toast';

/**
 * Toast utility functions for consistent notifications throughout the app
 */

export const showToast = {
    /**
     * Show a success toast
     * @param {string} message - The message to display
     * @param {object} options - Additional toast options
     */
    success: (message, options = {}) => {
        toast.success(message, {
            icon: '✓',
            ...options,
        });
    },

    /**
     * Show an error toast
     * @param {string} message - The message to display
     * @param {object} options - Additional toast options
     */
    error: (message, options = {}) => {
        toast.error(message, {
            icon: '✕',
            ...options,
        });
    },

    /**
     * Show an info toast
     * @param {string} message - The message to display
     * @param {object} options - Additional toast options
     */
    info: (message, options = {}) => {
        toast(message, {
            icon: 'ℹ️',
            style: {
                background: '#3B82F6',
                color: '#fff',
            },
            ...options,
        });
    },

    /**
     * Show a warning toast
     * @param {string} message - The message to display
     * @param {object} options - Additional toast options
     */
    warning: (message, options = {}) => {
        toast(message, {
            icon: '⚠️',
            style: {
                background: '#F59E0B',
                color: '#fff',
            },
            ...options,
        });
    },

    /**
     * Show a loading toast that can be updated
     * @param {string} message - The message to display
     * @returns {string} - The toast ID for updating
     */
    loading: (message) => {
        return toast.loading(message, {
            style: {
                background: '#6366F1',
                color: '#fff',
            },
        });
    },

    /**
     * Update a loading toast to success
     * @param {string} toastId - The toast ID to update
     * @param {string} message - The success message
     */
    updateSuccess: (toastId, message) => {
        toast.success(message, {
            id: toastId,
            icon: '✓',
        });
    },

    /**
     * Update a loading toast to error
     * @param {string} toastId - The toast ID to update
     * @param {string} message - The error message
     */
    updateError: (toastId, message) => {
        toast.error(message, {
            id: toastId,
            icon: '✕',
        });
    },

    /**
     * Dismiss a specific toast
     * @param {string} toastId - The toast ID to dismiss
     */
    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    /**
     * Dismiss all toasts
     */
    dismissAll: () => {
        toast.dismiss();
    },

    /**
     * Show a promise toast (auto-updates based on promise state)
     * @param {Promise} promise - The promise to track
     * @param {object} messages - Object with loading, success, error messages
     */
    promise: (promise, messages) => {
        return toast.promise(promise, {
            loading: messages.loading || 'Loading...',
            success: messages.success || 'Success!',
            error: messages.error || 'Something went wrong',
        });
    },

    /**
     * Show a custom toast with action button
     * @param {string} message - The message to display
     * @param {object} action - Object with label and onClick
     */
    withAction: (message, action) => {
        toast(
            (t) => (
                <div className="flex items-center gap-3">
                    <span>{message}</span>
                    <button
                        onClick={() => {
                            action.onClick();
                            toast.dismiss(t.id);
                        }}
                        className="px-3 py-1 text-sm font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
                    >
                        {action.label}
                    </button>
                </div>
            ),
            {
                duration: 6000,
                style: {
                    background: '#6366F1',
                    color: '#fff',
                },
            }
        );
    },
};

export default showToast;
