'use client';

import { useEffect, useState } from "react";
import { NaetworkIntuitiveV2 } from "@/components/NaetworkIntuitiveV2";

function isTaskSubmit(input: RequestInfo | URL, init?: RequestInit) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  return url.includes("/api/tasks") && String(init?.method || "GET").toUpperCase() === "POST";
}

export function NaetworkEndToEndV5() {
  const [taskUrl, setTaskUrl] = useState("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);

      if (isTaskSubmit(input, init)) {
        response
          .clone()
          .json()
          .then((result) => {
            if (result?.taskUrl) {
              setTaskUrl(String(result.taskUrl));
              setDismissed(false);
            }
          })
          .catch(() => undefined);
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      <NaetworkIntuitiveV2 />
      {taskUrl && !dismissed && (
        <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4">
          <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_90px_rgba(15,23,42,.22)] sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-black text-[#071527]">Din opgave er oprettet</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Du kan nu åbne opgavesiden, følge status og tilføje mere information.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button onClick={() => setDismissed(true)} className="rounded-full border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">Senere</button>
                <a href={taskUrl} className="rounded-full bg-[#071527] px-5 py-3 text-center text-sm font-black text-white hover:bg-[#0b203a]">Se min opgave</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
