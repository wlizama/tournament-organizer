"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const people = [
  { name: "Wade Cooper", username: "@wadecooper" },
  { name: "Arlene Mccoy", username: "@arlenemccoy" },
  { name: "Devon Webb", username: "@devonwebb" },
  { name: "Tom Cook", username: "@tomcook" },
  { name: "Tanya Fox", username: "@tanyafox" },
  { name: "Hellen Schmidt", username: "@hellenschmidt" },
  { name: "Caroline Schultz", username: "@carolineschultz" },
  { name: "Mason Heaney", username: "@masonheaney" },
  { name: "Claudie Smitham", username: "@claudiesmitham" },
  { name: "Emil Schaefer", username: "@emilschaefer" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ListBox() {
  const [selected, setSelected] = useState(people[3]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm leading-6 text-gray-900">
            Assigned to
          </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm sm:leading-6">
              <span className="inline-flex w-full truncate">
                <span>{selected.name}</span>
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
                {people.map((person) => (
                  <Listbox.Option
                    key={person.username}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="block">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "text-base"
                            )}
                          >
                            {person.name}
                          </span>
                        </div>
                        <div className="">
                          <span
                            className={classNames(
                              active ? "text-indigo-200" : "text-gray-500"
                            )}
                          >
                            Set the games scores and the system calculates the
                            games results. The match score is the number of
                            games won and determines the match winner.
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
  );
}
