"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TbCheck } from "react-icons/tb";
import { MdArrowBackIosNew } from "react-icons/md";
import { format } from "date-fns";

export default function TeamSelectModal({
  participants,
  handleAdd,
  handleCloseModal,
  selectedTeam,
  handleSelectTeam,
  open,
  setOpen,
  seededParticipants,
}: any) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto xl:pl-72">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex flex-1 flex-col transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-[80%] xl:max-w-[70%] h-[80vh]">
                <div className="hidden sm:block p-4">
                  <h2 className="text-xl sm:text-2xl font-medium">
                    Select a participant for Stage
                  </h2>
                </div>

                <div className="flex flex-1 flex-nowrap flex-col box-border p-4 overflow-hidden break-words text-sm">
                  {/* HEADER FOR TEAM LIST */}
                  <div className="block box-border min-w-0 flex-grow-0 flex-shrink-0 flex-auto border-b">
                    <div className="flex items-center min-h-[1.75rem] p-2">
                      <div className=""></div>
                      <div className="flex flex-[10_1_0%] items-center font-normal ml-2">
                        Name
                      </div>
                      <div className="hidden sm:block flex-[3_1_0%] text-center min-w-[7rem] w-40 font-normal">
                        Creation date
                      </div>
                      <div className="w-20 text-center font-normal">Seed</div>
                    </div>
                  </div>

                  {/* TEAM LIST CONTAINER */}
                  <div className="block box-border flex-1 overflow-y-auto pt-0">
                    <div className="flex flex-nowrap flex-col ">
                      <div className="min-w-0 flex-grow-0 flex-shrink-0 flex-auto">
                        {participants.length === 0 ? (
                          <p>No participants found</p>
                        ) : (
                          participants.map((p: any) => (
                            <div
                              key={p.id}
                              className="flex items-center min-h-[1.75rem] p-2 w-auto border-b"
                            >
                              <div className="">
                                <input
                                  type="radio"
                                  value={p.id}
                                  checked={selectedTeam?.id === p.id}
                                  onChange={() => handleSelectTeam(p)}
                                />
                              </div>
                              <div className="flex flex-[10_1_0%] items-center ml-2">
                                {p.name}
                              </div>
                              <div className="hidden sm:block flex-[3_1_0%] text-center text-xs text-gray-500 min-w-[7rem] w-40">
                                {format(
                                  p.created_at,
                                  "MMM d, yyyy, h:mm:ss aa"
                                )}
                              </div>
                              <div className="w-20 text-center text-xs text-gray-500">
                                {seededParticipants.findIndex(
                                  (i: any) => i?.id === p.id
                                ) == -1 ? (
                                  <>&nbsp;</>
                                ) : (
                                  seededParticipants.findIndex(
                                    (i: any) => i?.id === p.id
                                  ) + 1
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <button onClick={handleAdd}>Add</button>
                  <button onClick={handleCloseModal}>Cancel</button> */}
                </div>

                {/* FOOTER MOBILE HIDE */}
                <div className="hidden sm:block p-4">
                  <div className="flex flex-wrap box-border items-center justify-between">
                    <div className="flex-grow-0 flex-shrink-0 flex-auto min-w-0">
                      <button
                        type="button"
                        className="block w-full h-full items-center rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        onClick={handleCloseModal}
                        ref={cancelButtonRef}
                      >
                        <div className="flex items-center gap-2">
                          <MdArrowBackIosNew className="h-5 w-5" />
                          Cancel
                        </div>
                      </button>
                    </div>
                    <div className="flex-grow-0 flex-shrink-0 flex-auto min-w-0">
                      <button
                        type="button"
                        className="block w-full justify-center rounded-md bg-[#111] px-3 py-2 text-white shadow-sm"
                        onClick={handleAdd}
                      >
                        <div className="flex items-center gap-2">
                          <TbCheck className="h-5 w-5" />
                          Validate
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
