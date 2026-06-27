import type { Filters } from "../../hooks/useFilters";
import type { TaskStatus } from "../../types/task";
import "./FilterBar.css";

type FilterBarProps = {
  filters: Filters;
  onChange: (updates: Partial<Filters>) => void;
};

const ALL_STATUSES: TaskStatus[] = ["Backlog", "In Progress", "Done"];

function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggleStatus(status: TaskStatus) {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ statuses: next });
  }

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="filter-search"
        value={filters.search}
        placeholder="Search tasks..."
        aria-label="Search tasks"
        onChange={(e) => onChange({ search: e.target.value })}
      />

      <div className="filter-statuses" role="group" aria-label="Filter by status">
        {ALL_STATUSES.map((status) => (
          <label key={status} className="status-checkbox">
            <input
              type="checkbox"
              checked={filters.statuses.includes(status)}
              onChange={() => toggleStatus(status)}
            />
            {status}
          </label>
        ))}
      </div>

      <select
        className="filter-select"
        value={filters.priority}
        aria-label="Filter by priority"
        onChange={(e) =>
          onChange({ priority: e.target.value as Filters["priority"] })
        }
      >
        <option value="All">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <div className="filter-sort">
        <select
          className="filter-select"
          value={filters.sortField}
          aria-label="Sort by"
          onChange={(e) =>
            onChange({ sortField: e.target.value as Filters["sortField"] })
          }
        >
          <option value="updatedAt">Last updated</option>
          <option value="createdAt">Created</option>
          <option value="priority">Priority</option>
        </select>
        <button
          className="sort-order-btn"
          onClick={() =>
            onChange({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
          title={filters.sortOrder === "asc" ? "Ascending — click to flip" : "Descending — click to flip"}
          aria-label={`Sort ${filters.sortOrder === "asc" ? "ascending" : "descending"}`}
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
