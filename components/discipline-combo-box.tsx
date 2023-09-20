import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useSWR from "swr";
import { Discipline } from "@prisma/client";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DisciplineComboBox({
  disciplines,
  platforms,
  setPlatform,
  setValue,
  value,
}: any) {
  const [query, setQuery] = useState("");

  function handleChange(value: any) {
    setValue(value.id);
    setPlatform(value.platforms_available);
    platforms([]);
  }

  disciplines.sort((a: any, b: any) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  const filteredDiscipline =
    query === ""
      ? disciplines
      : disciplines.filter((discipline: any) => {
          return discipline.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={value.id} onChange={handleChange}>
      <Combobox.Label className="block text-sm">Discipline</Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          required
          className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-black focus:outline-none focus:ring-0 focus:ring-black sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(discipline: any) => discipline?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredDiscipline.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredDiscipline.map((discipline: any) => (
              <Combobox.Option
                key={discipline.id}
                value={discipline}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-[#111] text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {discipline.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
