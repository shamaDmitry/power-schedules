"use client";

import { GROUP_NAMES } from "@/utils/groupNames";

export default function GroupSelector({ group, setGroup }) {
  return (
    <>
      <select
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        className="border p-2 rounded bg-white"
      >
        {GROUP_NAMES.map((g) => (
          <option key={g} value={g}>
            {g}-а черга
          </option>
        ))}
      </select>
    </>
  );
}
