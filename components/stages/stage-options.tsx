"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  TbDotsVertical,
  TbListNumbers,
  TbTrash,
  TbUsers,
} from "react-icons/tb";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  stageId: string;
  tournamentId: string;
}

export function StageOptions({ stageId, tournamentId }: Props) {
  return (
    <Menu as="div" className="relative inline-block ml-4 text-left">
      <div>
        <Menu.Button className="flex text-neutral-400 hover:text-neutral-600">
          <span className="sr-only">Open options</span>
          <TbDotsVertical className="h-5 w-5" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute -right-28 z-10 mt-2 w-56 origin-top divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TbListNumbers className="h-5 w-5" />
                  <span className="ml-2">Result</span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TbUsers className="h-5 w-5" />
                  <span className="ml-2">Placement</span>
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/tournaments/${tournamentId}/stages/${stageId}/delete`}
                  className={classNames(
                    active ? "bg-red-100 text-red-900" : "text-red-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TbTrash className="h-5 w-5" />
                  <span className="ml-2">Delete</span>
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
