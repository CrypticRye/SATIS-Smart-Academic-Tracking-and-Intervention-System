import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

const toneStyles = {
    default: {
        container: "border-gray-200 bg-white text-gray-900",
        label: "text-gray-500",
        value: "text-gray-900",
        helper: "text-gray-500",
        icon: "text-gray-400",
    },
    indigo: {
        container: "border-indigo-100 bg-indigo-50 text-indigo-900",
        label: "text-indigo-600",
        value: "text-indigo-900",
        helper: "text-indigo-700",
        icon: "text-indigo-500",
    },
    emerald: {
        container: "border-emerald-100 bg-emerald-50 text-emerald-900",
        label: "text-emerald-600",
        value: "text-emerald-900",
        helper: "text-emerald-700",
        icon: "text-emerald-500",
    },
    amber: {
        container: "border-amber-100 bg-amber-50 text-amber-900",
        label: "text-amber-600",
        value: "text-amber-900",
        helper: "text-amber-700",
        icon: "text-amber-500",
    },
    sky: {
        container: "border-sky-100 bg-sky-50 text-sky-900",
        label: "text-sky-600",
        value: "text-sky-900",
        helper: "text-sky-700",
        icon: "text-sky-500",
    },
};

const renderBreadcrumb = (crumb, isLast) => {
    const baseClasses = isLast
        ? "text-gray-700"
        : "text-indigo-600 hover:text-indigo-700";

    if (crumb.href) {
        return (
            <Link
                href={crumb.href}
                className={`text-sm font-medium ${baseClasses}`}
            >
                {crumb.label}
            </Link>
        );
    }

    if (crumb.onClick) {
        return (
            <button
                type="button"
                onClick={crumb.onClick}
                disabled={crumb.disabled}
                className={`text-sm font-medium disabled:cursor-default disabled:text-gray-400 ${baseClasses}`}
            >
                {crumb.label}
            </button>
        );
    }

    return (
        <span className={`text-sm font-medium ${baseClasses}`}>
            {crumb.label}
        </span>
    );
};

const TeacherHero = ({
    breadcrumbs = [],
    title,
    subtitle,
    stats = [],
    actions = [],
}) => {
    const normalizedActions = React.Children.toArray(actions).filter(Boolean);

    return (
        <header className="mb-8 space-y-4">
            {breadcrumbs.length > 0 && (
                <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <React.Fragment key={`${crumb.label}-${index}`}>
                                {renderBreadcrumb(crumb, isLast)}
                                {!isLast && (
                                    <ChevronRight
                                        size={14}
                                        className="text-gray-400"
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            )}

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="max-w-3xl text-gray-500">{subtitle}</p>
                    )}
                </div>
                {normalizedActions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        {normalizedActions.map((action, index) => (
                            <div key={index} className="flex-shrink-0">
                                {action}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {stats.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const tone =
                            toneStyles[stat.tone] || toneStyles.default;
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.id || `${stat.label}-${index}`}
                                className={`rounded-2xl border p-4 shadow-sm ${tone.container}`}
                            >
                                <p
                                    className={`text-xs font-semibold uppercase tracking-wide ${tone.label}`}
                                >
                                    {stat.label}
                                </p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    {Icon && (
                                        <Icon
                                            size={18}
                                            className={`${tone.icon}`}
                                        />
                                    )}
                                    <p
                                        className={`text-2xl font-bold ${tone.value}`}
                                    >
                                        {stat.value ?? "—"}
                                    </p>
                                </div>
                                {stat.helper && (
                                    <p
                                        className={`mt-1 text-sm ${tone.helper}`}
                                    >
                                        {stat.helper}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </header>
    );
};

export default TeacherHero;
