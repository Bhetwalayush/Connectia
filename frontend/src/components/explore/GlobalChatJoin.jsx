// Join screen for the public global chat room
import { useState } from "react";
import { generateRandomUsername } from "../../utils/randomUsername";

function GlobalChatJoin({ realUsername, onJoin }) {
  const [randomName, setRandomName] = useState(() => generateRandomUsername());

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 px-6 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">
            Global Chat Room
          </h1>
          <p className="mt-1 text-sm text-indigo-100">
            One room. Everyone. Right now.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <svg
              className="h-5 w-5 shrink-0 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <p className="text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">This room is fully public.</span>{" "}
              Anything you send here can be seen by anyone in the room, at any
              time. There's no privacy in this space — please don't share
              anything personal or sensitive.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onJoin(realUsername)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Join as yourself
              </span>
              <span className="block text-xs text-slate-500">
                Everyone will see you as @{realUsername}
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {realUsername.charAt(0).toUpperCase()}
            </span>
          </button>

          <div className="relative py-1 text-center">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-100" />
            <span className="relative bg-white px-3 text-xs font-medium text-slate-400">
              or stay anonymous
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Anonymous handle
                </p>
                <p className="text-base font-bold text-slate-900">
                  {randomName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRandomName(generateRandomUsername())}
                aria-label="Generate another username"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => onJoin(randomName)}
              className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Join anonymously
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalChatJoin;
