"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleDateTimeChange } from "@/lib/utils";

import { useRouter } from "next/navigation";

import { CheckCircleIcon } from "@heroicons/react/20/solid";

interface ParticipationSettingsProps {
  tournament: {
    id: string;
    timezone: string;
    participant_type: string;
    check_in_enabled: boolean;
    check_in_participant_enabled: boolean;
    check_in_participant_start_datetime: string | null;
    check_in_participant_end_datetime: string | null;
    team_min_size: number;
    team_max_size: number;
  } | null;
}

export default function ParticipantSettings({
  tournament,
}: ParticipationSettingsProps) {
  const id = tournament!.id;
  const timeZone = tournament!.timezone;

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

  const checkInStart = tournament!.check_in_participant_start_datetime;
  const checkInEnd = tournament!.check_in_participant_end_datetime;
  const participantType = tournament!.participant_type;

  // Break down date and time for registration datetimes
  const [openingDate, setOpeningDate] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [closingTime, setClosingTime] = useState("");

  useEffect(() => {
    if (checkInStart && (openingDate == "" || openingTime == "")) {
      const parsedDateTime = new Date(checkInStart);
      const formatString = "yyyy-MM-dd'T'HH:mmxxx";
      const convertedDate = formatInTimeZone(
        parsedDateTime,
        timeZone,
        formatString
      );

      const dateString = convertedDate.substring(0, 10);
      const timeString = convertedDate.substring(11, 16);

      setOpeningDate(dateString);
      setOpeningTime(timeString);
    }
  }, [checkInStart, openingDate, openingTime, timeZone]);

  useEffect(() => {
    if (checkInEnd && (closingDate == "" || closingTime == "")) {
      const parsedDateTime = new Date(checkInEnd);
      const formatString = "yyyy-MM-dd'T'HH:mmxxx";
      const convertedDate = formatInTimeZone(
        parsedDateTime,
        timeZone,
        formatString
      );

      const dateString = convertedDate.substring(0, 10);
      const timeString = convertedDate.substring(11, 16);

      setClosingDate(dateString);
      setClosingTime(timeString);
    }
  }, [checkInEnd, closingDate, closingTime, timeZone]);

  const [enableCheckIn, setEnableCheckIn] = useState(
    tournament?.check_in_enabled
  );
  const [checkInParticipant, setCheckInParticipant] = useState(
    tournament?.check_in_participant_enabled
  );
  const [teamMinSize, setTeamMinSize] = useState(tournament!.team_min_size);
  const [teamMaxSize, setTeamMaxSize] = useState(tournament!.team_max_size);

  const checkInStartDateTime = handleDateTimeChange(
    openingDate,
    openingTime,
    timeZone
  );

  const checkInEndDateTime = handleDateTimeChange(
    closingDate,
    closingTime,
    timeZone
  );

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = {
        id,
        enableCheckIn,
        checkInParticipant,
        checkInStartDateTime,
        checkInEndDateTime,
        teamMinSize,
        teamMaxSize,
      };
      const res = await fetch(`/api/tournaments/${tournament!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        localStorage.setItem("submitted", "true");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleCheckParticipant() {
    setEnableCheckIn(true);
    setCheckInParticipant(true);
  }

  function handleCheckOrganizer() {
    setEnableCheckIn(true);
    setCheckInParticipant(false);
  }

  function handleCheckNo() {
    setEnableCheckIn(false);
    setCheckInParticipant(false);
  }

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
            <form onSubmit={submitData} method="PATCH">
              <Tabs defaultValue="general" className="w-full mt-2">
                <TabsList className="max-w-full sm:w-auto justify-start overflow-x-auto">
                  <TabsTrigger value="general">General</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <div className="grid grid-cols-1 xl:grid-cols-2 xl:divide-x mt-6">
                    <div className="xl:pr-6">
                      <div className="gap-x-2 space-y-4">
                        <div className="pb-2 -mt-2">
                          <label className="text-sm text-gray-900">
                            Enable tournament check-in?
                          </label>
                          <fieldset className="mt-2">
                            <legend className="sr-only">
                              Enable tournament check-in?
                            </legend>
                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                              <div className="flex items-center">
                                <input
                                  id="participant"
                                  name="tournament-check-in"
                                  type="radio"
                                  checked={
                                    checkInParticipant === true &&
                                    enableCheckIn === true
                                  }
                                  onChange={handleCheckParticipant}
                                  className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                                />
                                <label
                                  htmlFor="participant"
                                  className="ml-3 block text-sm leading-6 text-gray-900"
                                >
                                  Participant
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="organizer"
                                  name="tournament-check-in"
                                  type="radio"
                                  checked={
                                    enableCheckIn === true &&
                                    checkInParticipant === false
                                  }
                                  onChange={handleCheckOrganizer}
                                  className="h-4 w-4 border-gray-300 text-[#111] focus:ring-0"
                                />
                                <label
                                  htmlFor="organizer"
                                  className="ml-3 block text-sm leading-6 text-gray-900"
                                >
                                  Organizer
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="no"
                                  name="tournament-check-in"
                                  type="radio"
                                  checked={
                                    enableCheckIn === false &&
                                    checkInParticipant == false
                                  }
                                  onChange={handleCheckNo}
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

                        <div className="">
                          <label
                            htmlFor="registration-opening"
                            className="block text-sm leading-6 text-gray-900"
                          >
                            Participant check-in opening
                            <span className="pl-2 text-xs font-light text-neutral-500">
                              (timezone: {timeZone})
                            </span>
                          </label>
                          <div className="grid grid-cols-3 items-start space-x-2">
                            <div className="col-start-1 col-span-2">
                              <input
                                type="date"
                                name="participant-check-in-opening-date"
                                id="participant-check-in-opening-date"
                                value={openingDate || ""}
                                onChange={(e) => setOpeningDate(e.target.value)}
                                className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <div className="col-span-1">
                              <input
                                type="time"
                                name="participant-check-in-opening-time"
                                id="participant-check-in-opening-time"
                                value={openingTime || ""}
                                onChange={(e) => setOpeningTime(e.target.value)}
                                className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="">
                          <label
                            htmlFor="registration-opening"
                            className="block text-sm leading-6 text-gray-900"
                          >
                            Participant check-in closing
                            <span className="pl-2 text-xs font-light text-neutral-500">
                              (timezone: {timeZone})
                            </span>
                          </label>
                          <div className="grid grid-cols-3 items-start space-x-2">
                            <div className="col-start-1 col-span-2">
                              <input
                                type="date"
                                name="participant-check-in-closing-date"
                                id="participant-check-in-closing-date"
                                value={closingDate || ""}
                                onChange={(e) => setClosingDate(e.target.value)}
                                className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <div className="col-span-1">
                              <input
                                type="time"
                                name="participant-check-in-closing-time"
                                id="participant-check-in-closing-time"
                                value={closingTime || ""}
                                onChange={(e) => setClosingTime(e.target.value)}
                                className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 xl:-mt-2 xl:pl-6 space-y-4">
                      <div className="pb-2">
                        <label className="text-sm text-neutral-500">
                          Type of participants
                        </label>
                        <fieldset className="mt-2" disabled>
                          <legend className="sr-only">
                            Types of participants?
                          </legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                            <div className="flex items-center">
                              <input
                                id="player"
                                name="participant-type"
                                type="radio"
                                defaultChecked={participantType === "player"}
                                className="h-4 w-4 border-gray-300 text-neutral-500 focus:ring-0"
                              />
                              <label
                                htmlFor="player"
                                className="ml-3 block text-sm leading-6 text-neutral-500"
                              >
                                Player
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="team"
                                name="participant-type"
                                type="radio"
                                defaultChecked={participantType === "team"}
                                className="h-4 w-4 border-gray-300 text-neutral-500 focus:ring-0"
                              />
                              <label
                                htmlFor="team"
                                className="ml-3 block text-sm leading-6 text-neutral-500"
                              >
                                Team
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>

                      {participantType === "team" && (
                        <>
                          <div className="">
                            <label
                              htmlFor="mininum-players"
                              className="block text-sm leading-6 text-gray-900"
                            >
                              Minimum number of players per team
                            </label>
                            <input
                              type="number"
                              name="minimum-players"
                              id="minimum-players"
                              value={teamMinSize || ""}
                              onChange={(e) =>
                                setTeamMinSize(e.target.valueAsNumber)
                              }
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="">
                            <label
                              htmlFor="maximum-players"
                              className="block text-sm leading-6 text-gray-900"
                            >
                              Maximum number of players per team
                            </label>
                            <input
                              type="text"
                              name="maximum-players"
                              id="maximum-players"
                              value={teamMaxSize || ""}
                              onChange={(e) =>
                                setTeamMaxSize(e.target.valueAsNumber)
                              }
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </>
                      )}
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
