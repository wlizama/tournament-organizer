"use client";

import Link from "next/link";
import { TbTrash } from "react-icons/tb";

interface Props {
  stageId: string;
  stageName: string;
  tournamentId: string;
}

export function DeleteStageActionPanel({
  stageId,
  stageName,
  tournamentId,
}: Props) {
  async function deleteStage() {
    "use client";
    const response = await fetch(`/api/stages/${stageId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      localStorage.setItem("deleted", "true");
      window.location.href = `/tournaments/${tournamentId}/stages`;
    }
  }

  return (
    <div className="mx-auto max-w-xl mt-8 bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-2xl font-medium leading-6 text-gray-900">
          Delete Stage &quot;{stageName}&quot;
        </h3>
        <div className="mt-4 max-w-xl text-sm text-gray-500">
          <p>
            Are you sure you want to delete the stage? All of your stage data
            will be permanently removed. This action cannot be undone.
          </p>
        </div>
        <div className="mt-5 flex flex-row-reverse gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            onClick={deleteStage}
          >
            <TbTrash className="h-5 w-5 mr-2" />
            Delete
          </button>
          <Link href={`/tournaments/${tournamentId}/stages`}>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
