"use client";

import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ striped = true, hoverable = true, className = "", ...props }, ref) => {
    return (
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table
          ref={ref}
          className={`
            w-full text-left text-sm
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = "Table";

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <thead
    ref={ref}
    className={`bg-slate-50 border-b border-slate-200 ${className}`}
    {...props}
  />
));

TableHead.displayName = "TableHead";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <tbody
    ref={ref}
    className={`divide-y divide-slate-200 ${className}`}
    {...props}
  />
));

TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={`hover:bg-slate-50 transition-colors ${className}`}
    {...props}
  />
));

TableRow.displayName = "TableRow";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <td ref={ref} className={`px-6 py-4 ${className}`} {...props} />
));

TableCell.displayName = "TableCell";

export const TableHeader = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={`px-6 py-3 font-semibold text-slate-900 text-sm ${className}`}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";
