"use client";

import { useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const todos = useQuery(api.todos.list);
  const create = useMutation(api.todos.create);
  const toggle = useMutation(api.todos.toggle);
  const remove = useMutation(api.todos.remove);
  const [draft, setDraft] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await create({ text });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center bg-zinc-100 px-4 py-16 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight">
          Todos
        </h1>

        <form
          onSubmit={onSubmit}
          className="mb-8 flex gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What needs doing?"
            className="min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2 text-base outline-none placeholder:text-zinc-400"
            aria-label="New todo"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Add
          </button>
        </form>

        {todos === undefined ? (
          <p className="text-center text-zinc-500">Loading…</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-zinc-500">
            No todos yet. Add one above.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggle({ id: todo._id })}
                  className="size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
                  aria-label={
                    todo.completed ? "Mark as not done" : "Mark as done"
                  }
                />
                <span
                  className={`min-w-0 flex-1 text-base ${
                    todo.completed
                      ? "text-zinc-400 line-through"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  type="button"
                  onClick={() => remove({ id: todo._id })}
                  className="shrink-0 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
