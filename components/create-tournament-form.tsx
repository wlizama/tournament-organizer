"use client";

import DisciplineComboBox from "@/components/discipline-combo-box";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Discipline } from "@prisma/client";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";

const labelStyle = "original";
const timezones = allTimezones;

const participantTypes = [
  { id: "single", title: "Players" },
  { id: "team", title: "Teams" },
];

interface Props {
  disciplines: Discipline[] | Response;
}

export default function CreateTournamentForm({ disciplines }: Props) {
  const [name, setName] = useState<string>("");
  const [discipline, setDiscipline] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [size, setSize] = useState<number>(0);
  const [participantType, setParticipantType] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");
  const [platformOptions, setPlatformOptions] = useState<string[]>([
    "PC",
    "Playstation 4",
    "Playstation 5",
    "Xbox One",
    "Xbox Series",
    "Switch",
  ]);
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});

  const { options: tzOptions, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const router = useRouter();

  useEffect(() => {
    // Update the checkboxStates object when the discipline changes
    const newCheckboxStates: { [key: string]: boolean } = {};
    platformOptions.forEach((string) => {
      newCheckboxStates[string] = false;
    });
    setCheckboxStates(newCheckboxStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discipline]);

  function handleRadioButton(value: string) {
    setParticipantType(value);
  }

  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    let options = [...platforms];
    if (e.target.checked) {
      options = [...platforms, e.target.value];
    } else {
      options.splice(platforms.indexOf(e.target.value), 1);
    }
    setPlatforms(options);
    setCheckboxStates({
      ...checkboxStates,
      [e.target.value]: e.target.checked,
    });
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {
        discipline,
        name,
        participantType,
        size,
        timezone,
        platforms,
      };
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const tournament = await res.json();
      if (res.ok) {
        router.replace(`/tournaments/${tournament.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-6" action="#" onSubmit={submitData} method="POST">
      <div className="border border-gray-300 px-4 py-5 sm:rounded-lg sm:p-6 bg-white">
        <div className="md:grid md:grid-cols-4 md:gap-6">
          <div className="mt-5 space-y-6 md:col-span-4 md:mt-0">
            {/*  */}
            <div className="mt-2 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="name" className="block text-sm">
                  Tournament name
                  <span className="pl-2 text-xs font-light text-neutral-500">
                    (maximun 30 characters)
                  </span>
                </label>
                <div className="mt-1">
                  <input
                    required
                    type="text"
                    name="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#111] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <DisciplineComboBox
              disciplines={disciplines}
              value={discipline}
              setValue={setDiscipline}
              setPlatform={setPlatformOptions}
              platforms={setPlatforms}
            />

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm">Platform(s)</h2>
              </div>

              <fieldset aria-required className="mt-2">
                <label className="sr-only"> Choose a platform option </label>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.keys(checkboxStates).map((option) => (
                    <li key={option}>
                      <input
                        required
                        type="checkbox"
                        id={option}
                        value={option}
                        checked={checkboxStates[option]}
                        onChange={handleCheck}
                        className="peer hidden"
                      />
                      <label
                        htmlFor={option}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white py-3 px-3 text-sm font-medium text-gray-700 hover:border-black peer-checked:border-transparent peer-checked:bg-black peer-checked:text-white peer-checked:hover:bg-black sm:flex-1"
                      >
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="size" className="block text-sm">
                  Size
                </label>
                <div className="mt-1 flex rounded-md">
                  <input
                    required
                    type="number"
                    name="size"
                    id="size"
                    onChange={(e) => setSize(e.target.valueAsNumber)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#111] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="participants" className="block text-sm">
                  Participants
                </label>
                <fieldset className="mt-3">
                  <legend className="sr-only">Participants</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-5">
                    {participantTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <input
                          required
                          id={type.id}
                          name="participants"
                          type="radio"
                          onChange={() => handleRadioButton(type.id)}
                          className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                        />
                        <label
                          htmlFor={type.id}
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          {type.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="timezone"
                  className="block text-sm leading-6 text-gray-900"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  required
                  // value={timezone}
                  defaultValue={""}
                  onChange={(e) => setTimezone(e.target.value)}
                  // Change default value to user's input
                  className="block w-full rounded border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 placeholder:text-neutral-400"
                >
                  <option value={""} disabled>
                    Select a timezone
                  </option>
                  {tzOptions.map((tz) => (
                    <option key={tz.value} value={tz.value} className="">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 py-2 px-4 text-sm font-medium text-black hover:bg-gray-200"
          >
            + Create
          </button>
        </div>
      </div>
    </form>
  );
}
