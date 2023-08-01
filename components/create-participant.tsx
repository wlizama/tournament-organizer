"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";

import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function CreateParticipantForm() {
  useEffect(() => {
    const isSubmitted = localStorage.getItem("submitted");
    if (isSubmitted) {
      setUpdateSuccess(true);
      localStorage.removeItem("submitted");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const router = useRouter();

  const [player1Name, setPlayer1Name] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");

  return (
    <>
      <div className="px-4 sm:px-6 md:px-8">
        <button
          className="text-sm mb-4 hover:text-[#333]"
          onClick={() => {
            router.back();
          }}
        >
          <span aria-hidden="true">&larr;</span> Back
        </button>
        <h1 className="text-3xl font-medium">Participant Settings</h1>
        {updateSuccess && (
          <div className="rounded-md bg-green-50 ring-1 ring-green-300 p-4 mt-4 -mb-4">
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
        )}
        <div className="-mx-4 mt-8 shadow sm:mx-0 rounded bg-white">
          <div className="py-3.5 px-6 text-left text-2xl">
            <form method="PATCH">
              <Tabs defaultValue="basic-information" className="w-full mt-2">
                <TabsList className="max-w-full sm:w-auto justify-start overflow-x-auto">
                  <TabsTrigger value="basic-information">
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger value="player-1">Player 1</TabsTrigger>
                  <TabsTrigger value="player-2">Player 2</TabsTrigger>
                  <TabsTrigger value="player-3">Player 3</TabsTrigger>
                  <TabsTrigger value="player-4">Player 4</TabsTrigger>
                  <TabsTrigger value="player-5">Player 5</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-information">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="team-name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Team name
                        </label>
                        <input
                          type="text"
                          name="team-name"
                          id="team-name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Main contact email
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Custom user identifier
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="player-1">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player name
                        </label>
                        <input
                          type="text"
                          name="player-name"
                          id="player-name"
                          value={player1Name}
                          onChange={(e) => setPlayer1Name(e.target.value)}
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player contact email
                        </label>
                        <input
                          type="email"
                          name="player-email"
                          id="player-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Custom user identifier
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="player-2">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player name
                        </label>
                        <input
                          type="text"
                          name="player-name"
                          id="player-name"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player contact email
                        </label>
                        <input
                          type="email"
                          name="player-email"
                          id="player-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Custom user identifier
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="player-3">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player name
                        </label>
                        <input
                          type="text"
                          name="player-name"
                          id="player-name"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player contact email
                        </label>
                        <input
                          type="email"
                          name="player-email"
                          id="player-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Custom user identifier
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="player-4">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player name
                        </label>
                        <input
                          type="text"
                          name="player-name"
                          id="player-name"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player contact email
                        </label>
                        <input
                          type="email"
                          name="player-email"
                          id="player-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Custom user identifier
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="player-5">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player name
                        </label>
                        <input
                          type="text"
                          name="player-name"
                          id="player-name"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="gap-x-6 space-y-4">
                      <div className="">
                        <label
                          htmlFor="player-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Player contact email
                        </label>
                        <input
                          type="email"
                          name="player-email"
                          id="player-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Custom user identifier
                        </label>
                        <input
                          type="email"
                          name="contact-email"
                          id="contact-email"
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded bg-[#111] px-5 py-2 text-sm text-white shadow-sm hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
