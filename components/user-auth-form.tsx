"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { IconLoader } from "@tabler/icons-react";

export function UserAuthForm() {
  const [isDiscordLoading, setIsDiscordLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  return (
    <div className="w-full max-w-xs self-center block">
      <span className="block relative box-border">
        <button
          type="button"
          className="min-w-full max-w-full h-12 px-3 flex justify-center items-center rounded-md bg-[#333] hover:bg-[#444] text-white"
          onClick={() => {
            setIsDiscordLoading(true);
            signIn("discord");
          }}
          disabled={isDiscordLoading}
        >
          {isDiscordLoading ? (
            <IconLoader className="h-5 w-5 animate-spin text-white mr-2" />
          ) : (
            <span className="flex mr-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0.5 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.317 4.541a19.562 19.562 0 0 0-4.885-1.54.074.074 0 0 0-.079.038c-.21.381-.444.879-.608 1.27-1.845-.28-3.68-.28-5.487 0-.163-.4-.406-.889-.617-1.27a.077.077 0 0 0-.079-.038c-1.714.3-3.354.826-4.885 1.54a.07.07 0 0 0-.032.028C.533 9.293-.32 13.9.099 18.451a.084.084 0 0 0 .031.057 19.781 19.781 0 0 0 5.993 3.079.077.077 0 0 0 .084-.029c.462-.64.874-1.316 1.226-2.026a.078.078 0 0 0-.041-.107 13.011 13.011 0 0 1-1.872-.907.079.079 0 0 1-.008-.13 9.85 9.85 0 0 0 .372-.296.073.073 0 0 1 .078-.01c3.927 1.822 8.18 1.822 12.061 0a.073.073 0 0 1 .079.009c.12.1.245.201.372.297a.079.079 0 0 1-.006.13c-.598.355-1.22.655-1.873.906a.078.078 0 0 0-.041.108c.36.71.772 1.385 1.225 2.026a.075.075 0 0 0 .084.029 19.715 19.715 0 0 0 6.002-3.079.079.079 0 0 0 .032-.056c.5-5.26-.838-9.83-3.549-13.882a.061.061 0 0 0-.031-.029ZM8.02 15.681c-1.182 0-2.157-1.104-2.157-2.459s.956-2.458 2.157-2.458c1.21 0 2.176 1.113 2.157 2.458 0 1.355-.956 2.458-2.157 2.458Zm7.975 0c-1.183 0-2.157-1.104-2.157-2.459s.955-2.458 2.157-2.458c1.21 0 2.176 1.113 2.157 2.458 0 1.355-.946 2.458-2.157 2.458Z"
                  fill="#fff"
                />
              </svg>
            </span>
          )}
          Continue with Discord
        </button>
      </span>
      <span className="block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6 mt-[11px]"></span>
      <span className="block relative box-border">
        <button
          type="button"
          className="min-w-full max-w-full h-12 px-3 flex justify-center items-center rounded-md bg-[#333] hover:bg-[#444] text-white"
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <IconLoader className="h-5 w-5 animate-spin text-white mr-2" />
          ) : (
            <span className="flex mr-2">
              <svg
                fill="#fff"
                width="20"
                height="20"
                viewBox="-2 -2 24 24"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin"
              >
                <path d="M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z" />
              </svg>
            </span>
          )}
          Continue with Google
        </button>
      </span>
      <span className="mt-[11px] block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6"></span>
    </div>
  );
}
