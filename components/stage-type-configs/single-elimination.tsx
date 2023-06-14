"use client";

import { useRouter } from "next/navigation";
import { useState, Fragment } from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { TbPlus } from "react-icons/tb";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  stagesCount: number;
  tournamentId: string;
}

interface MatchSettings {
  format: {
    type: string;
    options: Record<string, any>;
  };
}

interface MatchOption {
  [key: string]: { value: string; label: string }[] | Record<string, any>;
}

export function SingleEliminationConfig({ stagesCount, tournamentId }: Props) {
  const [number, setNumber] = useState(stagesCount + 1);
  const [name, setName] = useState("Playoffs");
  const [autoPlacement, setAutoPlacement] = useState(false);

  const router = useRouter();
  const type = "single_elimination";

  const verboseNames: Record<string, string> = {
    calculation: "Calculation",
    interrupt: "Automatically end the match when a winner is known?",
    nb_match_sets: "Maximum number of games",
  };
  const descriptions: Record<string, string> = {
    none: "Set every score and result manually",
    score:
      "Set the games scores and the system calculates the games results. The match score is the number of games won and determines the match winner.",
    outcome:
      "Set the games results. The match score is calculated from the number of games won and determines the match winner.",
  };
  const [settings, setSettings] = useState({
    size: 0,
    third_decider: false,
    threshold: 0,
  });
  const [matchSettings, setMatchSettings] = useState<MatchSettings>({
    format: {
      type: "",
      options: {},
    },
  });
  const [matchOptions] = useState<MatchOption>({
    no_sets: {},
    inherited_format: {},
    single_set: {
      calculation: [
        {
          value: "none",
          label: "None",
          description: descriptions.none,
        },
        {
          value: "score",
          label: "Score-based",
          description: descriptions.score,
        },
        {
          value: "outcome",
          label: "Result-based",
          description: descriptions.outcome,
        },
      ],
    },
    home_and_away: {
      calculation: [
        {
          value: "none",
          label: "None",
          description: descriptions.none,
        },
        {
          value: "score",
          label: "Score-based",
          description: descriptions.score,
        },
      ],
    },
    best_of: {
      nb_match_sets: 0,
      interrupt: false,
      calculation: [
        {
          value: "none",
          label: "None",
          description: descriptions.none,
        },
        {
          value: "score",
          label: "Score-based",
          description: descriptions.score,
        },
        {
          value: "outcome",
          label: "Result-based",
          description: descriptions.outcome,
        },
      ],
    },
    fixed_sets: {
      nb_match_sets: 0,
      calculation: [
        {
          value: "none",
          label: "None",
          description: descriptions.none,
        },
        {
          value: "score",
          label: "Score-based",
          description: descriptions.score,
        },
        {
          value: "outcome",
          label: "Result-based",
          description: descriptions.outcome,
        },
      ],
    },
  });

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;

    setMatchSettings((prevMatchSettings) => ({
      ...prevMatchSettings,
      format: {
        ...prevMatchSettings.format,
        type: value,
        options: {}, // Reset options when the type changes
      },
    }));
  }

  function handleOptionChange(name: string, value: any) {
    setMatchSettings((prevMatchSettings) => ({
      format: {
        ...prevMatchSettings.format,
        options: {
          ...prevMatchSettings.format.options,
          [name]: value,
        },
      },
    }));
  }

  const submitData = async (e: React.SyntheticEvent) => {
    try {
      const body = {
        tournamentId,
        number,
        name,
        type,
        settings,
        matchSettings,
        autoPlacement,
      };
      const res = await fetch(`/api/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // router.replace logic here
        // console.log("Created stage successfully");
        router.push(`/tournaments/${tournamentId}/stages`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectedOptions = matchOptions[matchSettings.format.type] || {};

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-medium">
        Configure stage: Single Elimination
      </h1>
      <div className="-mx-4 mt-8 ring-1 ring-gray-300 sm:mx-0 rounded bg-white">
        <div className="py-3.5 px-6 text-left text-2xl">
          <form onSubmit={submitData} method="PATCH">
            <Tabs defaultValue="general" className="w-full mt-2">
              <TabsList className="max-w-full sm:w-auto justify-start overflow-x-auto">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="placement">Placement</TabsTrigger>
                <TabsTrigger value="match-settings">Match Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <div className="grid grid-cols-1 xl:grid-cols-2 xl:divide-x mt-6">
                  <div className="xl:pr-6">
                    <div className="gap-x-2 space-y-4">
                      <div className="">
                        <label
                          htmlFor="number"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Number
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger disabled>
                                <BsFillQuestionCircleFill className="ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">
                                  Number used to determine the order of the
                                  stages in the tournament. Two stages can not
                                  have the same number.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </label>
                        <input
                          type="number"
                          name="number"
                          id="number"
                          min={stagesCount + 1}
                          max={30}
                          required
                          value={number || ""}
                          onChange={(e) => setNumber(e.target.valueAsNumber)}
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="name"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Name{" "}
                          <span className="text-xs text-neutral-500 font-light">
                            (maximum 30 characters)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          maxLength={30}
                          required
                          value={name || ""}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 xl:m-0 xl:pl-6 space-y-2">
                    <div className="">
                      <label
                        htmlFor="size"
                        className="block text-sm leading-6 text-gray-900"
                      >
                        Size
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className="ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">
                                Number of participants at the beginning of the
                                stage.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        name="size"
                        id="size"
                        required
                        value={settings.size || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            size: e.target.valueAsNumber,
                          })
                        }
                        className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="pb-2">
                      <label className="text-sm text-gray-900">
                        3rd/4th decider match?
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className="ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">
                                If enabled, a 3rd place decider match is added
                                to the bracket, to rank the semifinals losers.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <fieldset>
                        <legend className="sr-only">
                          3rd/4th decider match?
                        </legend>
                        <div className="mt-2 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                          <div className="flex items-center">
                            <input
                              id="yes"
                              name="decider-match"
                              type="radio"
                              checked={settings.third_decider === true}
                              onChange={() =>
                                setSettings({
                                  ...settings,
                                  third_decider: true,
                                })
                              }
                              className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-0"
                            />
                            <label
                              htmlFor="yes"
                              className="ml-3 block text-sm leading-6 text-gray-900"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="no"
                              name="decider-match"
                              type="radio"
                              checked={settings.third_decider === false}
                              onChange={() =>
                                setSettings({
                                  ...settings,
                                  third_decider: false,
                                })
                              }
                              className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-0"
                            />
                            <label
                              htmlFor="no"
                              className="ml-3 block text-sm leading-6 text-gray-900"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 xl:grid-cols-2 mt-6">
                  <div className="gap-x-6 space-y-4">
                    <div className="">
                      <label
                        htmlFor="threshold"
                        className="block text-sm leading-6 text-gray-900"
                      >
                        Threshold
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className="ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">
                                Number of participants that will get qualified
                                at the end of this stage. Will remove the
                                unnecessary matches.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        name="threshold"
                        id="threshold"
                        min={0}
                        value={settings.threshold || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            threshold: e.target.valueAsNumber,
                          })
                        }
                        className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="placement">
                <div className="mt-6">
                  <div className="gap-x-2 space-y-4">
                    <div className="pb-2 -mt-2">
                      <label className="text-sm text-gray-900">
                        Place participants automatically?
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className="ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">
                                If enabled, participants will automatically be
                                placed in the stage using their creation order
                                as seeding.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <fieldset className="mt-2">
                        <legend className="sr-only">
                          Place participants automatically?
                        </legend>
                        <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                          <div className="flex items-center">
                            <input
                              id="yes"
                              name="auto-placement"
                              type="radio"
                              checked={autoPlacement === true}
                              onChange={() => setAutoPlacement(true)}
                              className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                            />
                            <label
                              htmlFor="yes"
                              className="ml-3 block text-sm leading-6 text-gray-900"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="no"
                              name="auto-placement"
                              type="radio"
                              checked={autoPlacement === false}
                              onChange={() => setAutoPlacement(false)}
                              className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                            />
                            <label
                              htmlFor="no"
                              className="ml-3 block text-sm leading-6 text-gray-900"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="match-settings">
                <div className="grid grid-cols-1 xl:grid-cols-2 mt-6">
                  <div className="col-span-1">
                    <label
                      htmlFor="location"
                      className="block text-sm leading-6 text-gray-900"
                    >
                      Format
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger disabled>
                            <BsFillQuestionCircleFill className="ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              Define the match format to be applied to this
                              element (tournament, stage, group, round or match)
                              of the tournament, and all elements that depend of
                              it.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <select
                      id="location"
                      name="location"
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-[#111] sm:text-sm sm:leading-6"
                      value={matchSettings.format.type}
                      onChange={handleTypeChange}
                    >
                      <option value="" disabled>
                        Select a format
                      </option>
                      <option value={"inherited_format"}>
                        Inherited Format
                      </option>
                      <option value={"no_sets"}>No games</option>
                      <option value={"single_set"}>Single game</option>
                      <option value={"home_and_away"}>Home and away</option>
                      <option value={"best_of"}>Best-of</option>
                      <option value={"fixed_sets"}>Fixed games</option>
                    </select>
                  </div>

                  {Object.entries(selectedOptions).map(([key, value]) => {
                    if (key === "interrupt") {
                      return (
                        <div key={key} className="mt-2">
                          <label
                            htmlFor={key}
                            className="text-sm text-gray-900"
                          >
                            {verboseNames[key] || key}
                          </label>
                          <fieldset className="mt-2">
                            <legend className="sr-only">
                              {verboseNames[key] || key}
                            </legend>
                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name={key}
                                  checked={
                                    matchSettings.format.options[key] === true
                                  }
                                  onChange={() =>
                                    setMatchSettings({
                                      ...matchSettings,
                                      format: {
                                        ...matchSettings.format,
                                        options: {
                                          ...matchSettings.format.options,
                                          interrupt: true,
                                        },
                                      },
                                    })
                                  }
                                  className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                                />
                                <label
                                  htmlFor="yes"
                                  className="ml-3 block text-sm leading-6 text-gray-900"
                                >
                                  Yes
                                </label>
                              </div>

                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name={key}
                                  checked={
                                    matchSettings.format.options[key] === false
                                  }
                                  onChange={() =>
                                    setMatchSettings({
                                      ...matchSettings,
                                      format: {
                                        ...matchSettings.format,
                                        options: {
                                          ...matchSettings.format.options,
                                          interrupt: false,
                                        },
                                      },
                                    })
                                  }
                                  className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                                />

                                <label
                                  htmlFor="no"
                                  className="ml-3 block text-sm leading-6 text-gray-900"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="xl:col-span-2 mt-2">
                        <label htmlFor={key} className="text-sm">
                          {verboseNames[key] || key}
                        </label>
                        {Array.isArray(value) ? (
                          <Listbox
                            value={matchSettings.format.options[key] || ""}
                            onChange={(newValue) =>
                              handleOptionChange(key, newValue)
                            }
                          >
                            {({ open }) => (
                              <>
                                <div className="relative">
                                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-[#111] text-base sm:text-sm sm:leading-6">
                                    <span className="inline-flex w-full truncate">
                                      <span>
                                        {value.find(
                                          (option) =>
                                            option.value ===
                                            matchSettings.format.options[key]
                                        )?.label || "Select an option"}
                                      </span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Listbox.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {value.map((option) => (
                                        <Listbox.Option
                                          key={option.value}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? "bg-[#111] text-white"
                                                : "text-gray-900",
                                              "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                          }
                                          value={option.value}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <div className="block">
                                                <span
                                                  className={classNames(
                                                    selected
                                                      ? "font-semibold"
                                                      : "font-normal",
                                                    "text-base"
                                                  )}
                                                >
                                                  {option.label}
                                                </span>
                                              </div>
                                              <div className="">
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-neutral-200"
                                                      : "text-neutral-500"
                                                  )}
                                                >
                                                  {option.description}
                                                </span>
                                              </div>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-white"
                                                      : "text-[#111]",
                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                        ) : (
                          <input
                            type="number"
                            id={key}
                            name={key}
                            min={0}
                            value={matchSettings.format.options[key] || ""}
                            onChange={(e) =>
                              handleOptionChange(key, e.target.valueAsNumber)
                            }
                            className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="flex items-center rounded bg-[#111] px-5 py-2 text-sm text-white shadow-sm hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <TbPlus className="h-5 w-5 mr-2" />
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
