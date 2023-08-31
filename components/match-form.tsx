"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { FaCircleXmark } from "react-icons/fa6";

import { Group, Match, Round, Stage } from "@prisma/client";

import { Controller, useForm } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Participant = {
  id: string;
  name: string;
  created_at: string;
};

type Opponent = {
  forfeit: string;
  number: number;
  participant: Participant;
  position: number;
  rank: number | null;
  result: string;
  score: number | null;
};

interface MatchProps {
  match: Match & {
    stage: {
      id: string;
      number: number;
      name: string;
    };
    group: {
      id: string;
      number: number;
      name: string;
    };
    round: {
      id: string;
      number: number;
      name: string;
    };
    tournament: {
      timezone: string;
    };
  };
}

export default function MatchForm({ match }: MatchProps) {
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [teamOneValue, setTeamOneValue] = useState<string | false | 0 | null>(
    ""
  );
  const [teamTwoValue, setTeamTwoValue] = useState<string | false | 0 | null>(
    ""
  );
  // console.log(match.opponents);

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      opponent1: {
        score: match.opponents[0] && (match.opponents[0] as Opponent).score,
        result: match.opponents[0] && (match.opponents[0] as Opponent).result,
      },
      opponent2: {
        score: match.opponents[1] && (match.opponents[1] as Opponent).score,
        result: match.opponents[1] && (match.opponents[1] as Opponent).result,
      },
    },
  });

  useEffect(() => {
    const isSubmitted = localStorage.getItem("submitted");
    if (isSubmitted) {
      setUpdateSuccess(true);
      localStorage.removeItem("submitted");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitData = async (data: any) => {
    // console.log(data);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        localStorage.setItem("submitted", "true");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleReset() {
    reset({
      opponent1: { result: "" },
      opponent2: { result: "" },
    });
  }

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <div className="relative my-10">
          <h1 className="text-3xl font-medium">
            Match #{match.stage.number}.{match.group.number}.
            {match.round.number}.{match.number}
          </h1>
        </div>
        {updateSuccess && (
          <div className="-mt-4 rounded-md bg-green-50 ring-1 ring-green-300 p-4">
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
        <div className="mt-4 shadow sm:mx-0 rounded bg-white">
          <div className="relative grid grid-flow-row p-5 gap-5">
            {/* SECONDARY */}
            <div className="w-full grid justify-center text-center">
              <div className="text-xs text-neutral-500">
                Playoffs - Main bracket - round 1
              </div>
            </div>
            {/* PRIMARY */}
            <div className="grid grid-rows-[auto] grid-cols-[1fr_auto_1fr] justify-stretch items-stretch gap-5">
              {/* Opponent #1 */}
              <div className="grid grid-flow-row justify-items-center items-center gap-3">
                <div className="text-2xl text-center break-words whitespace-normal">
                  {match.opponents[0] && match.opponents.length > 0 ? (
                    (match.opponents[0] as Opponent).participant?.name
                  ) : (
                    <div className="text-neutral-500">To be determined</div>
                  )}
                </div>
              </div>

              {/* Score state */}
              <div className="self-center justify-self-center grid items-center justify-items-stretch w-60 gap-5">
                {match.status === "running" && (
                  <div className="grid grid-flow-col grid-cols-[1fr_1fr] justify-items-center items-center gap-5 text-7xl">
                    {/* result 1 */}
                    <div className="w-full h-20 overflow-hidden grid justify-center content-center p-2 box-border text-center">
                      {(match.opponents[0] as Opponent).score !== null ? (
                        (match.opponents[0] as Opponent).score
                      ) : (
                        <>-</>
                      )}
                    </div>
                    {/* result 2 */}
                    <div className="w-full h-20 overflow-hidden grid justify-center content-center p-2 box-border text-center">
                      {(match.opponents[1] as Opponent).score !== null ? (
                        (match.opponents[1] as Opponent).score
                      ) : (
                        <>-</>
                      )}
                    </div>
                  </div>
                )}
                {match.status === "completed" && (
                  <div className="grid grid-flow-col grid-cols-[1fr_1fr] justify-items-center items-center gap-5 text-7xl">
                    {/* result 1 */}
                    {(match.opponents[0] as Opponent).result === "win" && (
                      <div className="w-full h-20 overflow-hidden grid justify-center content-center p-2 box-border text-center bg-green-500 text-white rounded">
                        {(match?.opponents[0] as Opponent).score}
                      </div>
                    )}
                    {(match.opponents[0] as Opponent).result === "loss" && (
                      <div className="w-full h-20 overflow-hidden grid justify-center content-center p-2 box-border text-center bg-red-500 text-white rounded">
                        {(match?.opponents[0] as Opponent).score}
                      </div>
                    )}
                    {/* result 2 */}
                    {(match.opponents[1] as Opponent).result === "win" && (
                      <div className="w-full h-20 overflow-hidden grid justify-center content-center p-2 box-border text-center bg-green-500 text-white rounded">
                        {(match?.opponents[1] as Opponent).score}
                      </div>
                    )}
                    {(match.opponents[1] as Opponent).result === "loss" && (
                      <div className="w-full h-20 overflow-hidden grid justify-center content-center p-2 box-border text-center bg-red-500 text-white rounded">
                        {(match?.opponents[1] as Opponent).score}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Opponent #2 */}
              <div className="grid grid-flow-row justify-items-center items-center gap-3">
                <div className="text-2xl text-center break-words whitespace-normal">
                  {match.opponents[1] && match.opponents.length > 0 ? (
                    (match.opponents[1] as Opponent).participant?.name
                  ) : (
                    <div className="text-neutral-500">To be determined</div>
                  )}
                </div>
              </div>
            </div>
            {/* SECONDARY */}
            <div className="w-full grid justify-center text-center">
              {match.status === "pending" && (
                <div className="text-base text-neutral-500">Match pending</div>
              )}
              {match.status === "running" && (
                <div className="text-base text-neutral-500">
                  Match in progress
                </div>
              )}
              {match.status === "completed" && (
                <div className="text-base text-green-500">Match completed</div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 shadow sm:mx-0 rounded bg-white">
          <div className="py-3.5 px-6 text-left text-2xl">
            <form onSubmit={handleSubmit(submitData)} method="PATCH">
              <Tabs defaultValue="result" className="w-full mt-2">
                <TabsList className="max-w-full sm:w-auto justify-start overflow-x-auto">
                  <TabsTrigger value="result">Result</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="result">
                  <div className="mt-4">
                    <div className="flex flex-col flex-nowrap">
                      <label htmlFor="match" className="mb-4">
                        Match
                      </label>
                      <div className="inline-flex flex-col relative">
                        <div className="flex flex-col">
                          <div className="flex flex-wrap py-3 items-center gap-3 border-b text-neutral-500">
                            <div className="block flex-[8_0_8rem] order-1 uppercase text-xs break-words">
                              Name
                            </div>
                            <div className="block flex-[1_0_5rem] order-2 uppercase text-xs text-center break-words">
                              Forfeit
                            </div>
                            <div className="block flex-[1_1_3rem] order-4 uppercase text-xs text-center break-words">
                              Score
                            </div>
                            <div className="flex-[1_1_9rem] flex items-center order-5 uppercase text-xs text-center justify-center break-words">
                              Result
                              <FaCircleXmark
                                className=" h-3.5 w-3.5 cursor-pointer ml-1"
                                onClick={() => handleReset()}
                              />
                            </div>
                          </div>
                          {/* OPPONENT #1 */}
                          <div className="flex flex-col">
                            {/* NAME */}
                            <div className="flex flex-wrap py-3 items-center gap-3">
                              <div className="flex-[8_0_8rem] order-1 text-lg font-bold">
                                {match.opponents[0] &&
                                match.opponents.length > 0 ? (
                                  (match.opponents[0] as Opponent).participant
                                    ?.name
                                ) : (
                                  <div className="text-neutral-500">
                                    To be determined
                                  </div>
                                )}
                              </div>
                              {/* FORFEIT */}
                              <div className="flex-[1_0_5rem] order-2 text-center">
                                <div className="relative flex gap-2 items-start justify-center">
                                  <input type="checkbox" className="" />
                                </div>
                              </div>
                              {/* SCORE */}
                              <div className="flex-[1_1_3rem] order-4 text-center">
                                <div className="relative">
                                  <input
                                    type="number"
                                    {...register("opponent1.score", {
                                      valueAsNumber: true,
                                    })}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              {/* RESULT */}
                              <div className="flex-[1_1_9rem] order-5 text-center">
                                <Controller
                                  name="opponent1.result"
                                  control={control}
                                  render={({ field }) => (
                                    <RadioGroup
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        // setTeamOneValue(value);
                                      }}
                                      className={
                                        "block overflow-hidden rounded text-sm"
                                      }
                                    >
                                      <RadioGroup.Label className={"sr-only"}>
                                        Result
                                      </RadioGroup.Label>
                                      <div className="flex flex-wrap box-border ms-[-1px] me-[-1px]">
                                        <div className="block flex-1">
                                          <RadioGroup.Option value={"win"}>
                                            {({ active, checked }) => (
                                              <span
                                                className={classNames(
                                                  checked
                                                    ? "bg-green-500 text-white"
                                                    : "bg-neutral-200",
                                                  "block relative cursor-pointer py-2 px-3 border border-white"
                                                )}
                                              >
                                                W
                                              </span>
                                            )}
                                          </RadioGroup.Option>
                                        </div>
                                        <div className="block flex-1">
                                          <RadioGroup.Option value={"draw"}>
                                            {({ checked }) => (
                                              <span
                                                className={classNames(
                                                  checked
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-neutral-200",
                                                  "block relative cursor-pointer py-2 px-3 border border-white"
                                                )}
                                              >
                                                D
                                              </span>
                                            )}
                                          </RadioGroup.Option>
                                        </div>
                                        <div className="block flex-1">
                                          <RadioGroup.Option value={"loss"}>
                                            {({ checked }) => (
                                              <span
                                                className={classNames(
                                                  checked
                                                    ? "bg-red-500 text-white"
                                                    : "bg-neutral-200",
                                                  "block relative cursor-pointer py-2 px-3 border border-white"
                                                )}
                                              >
                                                L
                                              </span>
                                            )}
                                          </RadioGroup.Option>
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {/* OPPONENT #2 */}
                          <div className="flex flex-col">
                            {/* NAME */}
                            <div className="flex flex-wrap py-3 items-center gap-3">
                              <div className="flex-[8_0_8rem] order-1 text-lg font-bold">
                                {match.opponents[1] &&
                                match.opponents.length > 0 ? (
                                  (match.opponents[1] as Opponent).participant
                                    ?.name
                                ) : (
                                  <div className="text-neutral-500">
                                    To be determined
                                  </div>
                                )}
                              </div>
                              {/* FORFEIT */}
                              <div className="flex-[1_0_5rem] order-2 text-center">
                                <div className="relative flex gap-2 items-start justify-center">
                                  <input type="checkbox" className="" />
                                </div>
                              </div>
                              {/* SCORE */}
                              <div className="flex-[1_1_3rem] order-4 text-center">
                                <div className="relative">
                                  <input
                                    type="number"
                                    {...register("opponent2.score", {
                                      valueAsNumber: true,
                                    })}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              {/* RESULT */}
                              <div className="flex-[1_1_9rem] order-5 text-center">
                                <Controller
                                  name="opponent2.result"
                                  control={control}
                                  render={({ field }) => (
                                    <RadioGroup
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        setTeamTwoValue(value);
                                      }}
                                      className={
                                        "block overflow-hidden rounded text-sm"
                                      }
                                    >
                                      <RadioGroup.Label className={"sr-only"}>
                                        Result
                                      </RadioGroup.Label>
                                      <div className="flex flex-wrap box-border ms-[-1px] me-[-1px]">
                                        <div className="block flex-1">
                                          <RadioGroup.Option value={"win"}>
                                            {({ checked }) => (
                                              <span
                                                className={classNames(
                                                  checked
                                                    ? "bg-green-500 text-white"
                                                    : "bg-neutral-200",
                                                  "block relative cursor-pointer py-2 px-3 border border-white"
                                                )}
                                              >
                                                W
                                              </span>
                                            )}
                                          </RadioGroup.Option>
                                        </div>
                                        <div className="block flex-1">
                                          <RadioGroup.Option value={"draw"}>
                                            {({ checked }) => (
                                              <span
                                                className={classNames(
                                                  checked
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-neutral-200",
                                                  "block relative cursor-pointer py-2 px-3 border border-white"
                                                )}
                                              >
                                                D
                                              </span>
                                            )}
                                          </RadioGroup.Option>
                                        </div>
                                        <div className="block flex-1">
                                          <RadioGroup.Option value={"loss"}>
                                            {({ checked }) => (
                                              <span
                                                className={classNames(
                                                  checked
                                                    ? "bg-red-500 text-white"
                                                    : "bg-neutral-200",
                                                  "block relative cursor-pointer py-2 px-3 border border-white"
                                                )}
                                              >
                                                L
                                              </span>
                                            )}
                                          </RadioGroup.Option>
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="">
                        <label
                          htmlFor="discord-link"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Registration closing
                          <span className="pl-2 text-xs font-light text-neutral-500">
                            timezone: Example/Asia
                          </span>
                        </label>
                        <div className="grid grid-cols-3 items-start space-x-2">
                          <div className="col-start-1 col-span-2">
                            <input
                              type="date"
                              name="discord-link"
                              id="discord-link"
                              // value={closingDate || ""}
                              // onChange={(e) => setClosingDate(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="time"
                              name="registration-closing-time"
                              id="registration-closing-time"
                              // value={closingTime || ""}
                              // onChange={(e) => setClosingTime(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="info">
                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-6">
                    <div className="space-y-4 lg:col-span-2">
                      <div className="">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900 overflow-visible"
                        >
                          Registration opening
                          <span className="pl-2 text-xs font-light text-neutral-500">
                            (timezone: {match.tournament.timezone})
                          </span>
                        </label>
                        <div className="grid grid-cols-3 items-start space-x-2">
                          <div className="col-start-1 col-span-2">
                            <input
                              type="date"
                              name="contact-email"
                              id="contact-email"
                              // value={openingDate || ""}
                              // onChange={(e) => setOpeningDate(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="time"
                              name="registration-opening-time"
                              id="registration-opening-time"
                              // value={openingTime || ""}
                              // onChange={(e) => setOpeningTime(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Private notes
                        </label>
                        <textarea
                          rows={4}
                          name="form-message"
                          id="form-message"
                          // value={registrationRequestMsg || ""}
                          // onChange={(e) =>
                          //   setRegistrationRequestMsg(e.target.value)
                          // }
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="">
                        <label
                          htmlFor="prize"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Public notes
                        </label>
                        <textarea
                          rows={4}
                          name="validation-message"
                          id="validation-message"
                          // value={registrationAcceptMsg || ""}
                          // onChange={(e) =>
                          //   setRegistrationAcceptMsg(e.target.value)
                          // }
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
