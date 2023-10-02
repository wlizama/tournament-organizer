"use client";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function UpdateSuccess() {
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const isSubmitted = localStorage.getItem("submitted");
    if (isSubmitted) {
      setUpdateSuccess(true);
      localStorage.removeItem("submitted");
    }
  }, []);

  if (updateSuccess) {
    return (
      <div className="-mt-4 mb-4 rounded-md bg-green-50 ring-1 ring-green-300 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Successfully updated
            </p>
          </div>
        </div>
      </div>
    );
  }
}
