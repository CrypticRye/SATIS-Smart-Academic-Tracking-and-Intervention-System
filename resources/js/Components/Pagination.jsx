import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

/**
 * Pagination component for large data sets
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items shown per page
 * @param {function} onPageChange - Callback when page changes
 * @param {function} onItemsPerPageChange - Callback when items per page changes
 * @param {boolean} showItemsPerPage - Whether to show items per page selector
 * @param {array} itemsPerPageOptions - Available items per page options
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange,
    showItemsPerPage = true,
    itemsPerPageOptions = [10, 25, 50, 100],
    className = "",
}) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1 && !showItemsPerPage) {
        return null;
    }

    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}
        >
            {/* Info and Items Per Page */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                        {startItem}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                        {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                        {totalItems}
                    </span>{" "}
                    results
                </span>

                {showItemsPerPage && onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span>Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) =>
                                onItemsPerPageChange(Number(e.target.value))
                            }
                            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Page Navigation */}
            <nav className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                >
                    <ChevronsLeft size={18} />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-gray-400"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors
                                    ${
                                        currentPage === page
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                >
                    <ChevronsRight size={18} />
                </button>
            </nav>
        </div>
    );
}

/**
 * Hook for handling pagination state
 * @param {Array} items - The full array of items to paginate
 * @param {number} initialItemsPerPage - Initial items per page
 */
export function usePagination(items = [], initialItemsPerPage = 10) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Reset to page 1 if current page exceeds total
    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Get current page items
    const paginatedItems = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        paginatedItems,
        handlePageChange,
        handleItemsPerPageChange,
    };
}
