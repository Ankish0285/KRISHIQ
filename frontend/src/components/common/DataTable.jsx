import { StatusBadge } from "./ui.jsx";

export default function DataTable({ columns, rows, rowKey = "id", empty = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row[rowKey]} className="border-t border-slate-100 dark:border-slate-800">
              {columns.map((c) => (
                <td key={c.key} className="whitespace-nowrap px-4 py-3 align-middle">
                  {c.render ? c.render(row) : c.status ? <StatusBadge status={row[c.key]} /> : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
