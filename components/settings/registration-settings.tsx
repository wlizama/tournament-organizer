"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleDateTimeChange } from "@/lib/utils";

import { useRouter } from "next/navigation";

import { CheckCircleIcon } from "@heroicons/react/20/solid";

interface RegistrationSettingsProps {
  tournament: {
    id: string;
    timezone: string;
    registration_enabled: boolean;
    registration_participant_email_enabled: boolean;
    registration_opening_datetime: string | null;
    registration_closing_datetime: string | null;
    registration_permanent_team_mandatory: boolean;
    registration_notification_enabled: boolean;
    registration_request_message: string | null;
    registration_acceptance_message: string | null;
    registration_refusal_message: string | null;
    registration_terms_enabled: boolean;
    registration_terms_url: string | null;
  } | null;
}

export default function RegistrationSettings({
  tournament,
}: RegistrationSettingsProps) {
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

  const registrationOpening = tournament!.registration_opening_datetime;
  const registrationClosing = tournament!.registration_closing_datetime;

  // Break down date and time for registration datetimes
  const [openingDate, setOpeningDate] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [closingTime, setClosingTime] = useState("");

  useEffect(() => {
    if (registrationOpening && (openingDate == "" || openingTime == "")) {
      const parsedDateTime = new Date(registrationOpening);
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
  }, [registrationOpening, openingDate, openingTime, timeZone]);

  useEffect(() => {
    if (registrationClosing && (closingDate == "" || closingTime == "")) {
      const parsedDateTime = new Date(registrationClosing);
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
  }, [registrationClosing, closingDate, closingTime, timeZone]);

  const [enableRegistration, setEnableRegistration] = useState(
    tournament!.registration_enabled
  );
  const [registrationAutoAccept, setRegistrationAutoAccept] = useState(
    tournament!.registration_participant_email_enabled
  );
  const [registrationPermanentTeam, setRegistrationPermanentTeam] = useState(
    tournament!.registration_permanent_team_mandatory
  );
  const [registrationNotification, setRegistrationNotification] = useState(
    tournament!.registration_notification_enabled
  );
  const [registrationRequestMsg, setRegistrationRequestMsg] = useState(
    tournament!.registration_request_message
  );
  const [registrationAcceptMsg, setRegistrationAcceptMsg] = useState(
    tournament!.registration_acceptance_message
  );
  const [registrationRefusalMsg, setRegistrationRefusalMsg] = useState(
    tournament!.registration_refusal_message
  );
  const [registrationTerms, setRegistrationTerms] = useState(
    tournament!.registration_terms_enabled
  );
  const [registrationTermsUrl, setRegistrationTermsUrl] = useState(
    tournament!.registration_terms_url
  );

  const registrationOpeningDateTime = handleDateTimeChange(
    openingDate,
    openingTime,
    timeZone
  );

  const registrationClosingDateTime = handleDateTimeChange(
    closingDate,
    closingTime,
    timeZone
  );

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = {
        id,
        enableRegistration,
        registrationOpeningDateTime,
        registrationClosingDateTime,
        registrationAutoAccept,
        registrationPermanentTeam,
        registrationNotification,
        registrationRequestMsg,
        registrationAcceptMsg,
        registrationRefusalMsg,
        registrationTerms,
        registrationTermsUrl,
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

  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <div className="mx-auto max-w-3xl">
        {/* <button
          className="text-sm mb-4 mt-8 hover:text-[#333]"
          onClick={() => {
            router.back();
          }}
        >
          <span aria-hidden="true">&larr;</span> Back
        </button> */}
        <div className="relative my-10">
          <h1 className="text-3xl font-medium">Registration Settings</h1>
        </div>
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
        <div className="shadow sm:mx-0 rounded bg-white">
          <div className="py-3.5 px-6 text-left text-2xl">
            <form onSubmit={submitData} method="PATCH">
              <Tabs defaultValue="activation" className="w-full mt-2">
                <TabsList className="max-w-full sm:w-auto justify-start overflow-x-auto">
                  <TabsTrigger value="activation">Activation</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                  <TabsTrigger value="customization">Customization</TabsTrigger>
                </TabsList>
                <TabsContent value="activation">
                  <div className="mt-6">
                    <div className="gap-x-2 space-y-4">
                      <div className="pb-2 -mt-2">
                        <label className="text-sm text-gray-900">
                          Enable Registration?
                        </label>
                        <fieldset className="mt-2">
                          <legend className="sr-only">
                            Enable Registration?
                          </legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                            <div className="flex items-center">
                              <input
                                id="yes"
                                name="played-on-the-internet"
                                type="radio"
                                checked={enableRegistration === true}
                                onChange={() => setEnableRegistration(true)}
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
                                name="played-on-the-internet"
                                type="radio"
                                checked={enableRegistration === false}
                                onChange={() => setEnableRegistration(false)}
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
                          htmlFor="contact-email"
                          className="block text-sm leading-6 text-gray-900 overflow-visible"
                        >
                          Registration opening
                          <span className="pl-2 text-xs font-light text-neutral-500">
                            (timezone: {timeZone})
                          </span>
                        </label>
                        <div className="grid grid-cols-3 items-start space-x-2">
                          <div className="col-start-1 col-span-2">
                            <input
                              type="date"
                              name="contact-email"
                              id="contact-email"
                              value={openingDate || ""}
                              onChange={(e) => setOpeningDate(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="time"
                              name="registration-opening-time"
                              id="registration-opening-time"
                              value={openingTime || ""}
                              onChange={(e) => setOpeningTime(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="">
                        <label
                          htmlFor="discord-link"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Registration closing
                          <span className="pl-2 text-xs font-light text-neutral-500">
                            (timezone: {timeZone})
                          </span>
                        </label>
                        <div className="grid grid-cols-3 items-start space-x-2">
                          <div className="col-start-1 col-span-2">
                            <input
                              type="date"
                              name="discord-link"
                              id="discord-link"
                              value={closingDate || ""}
                              onChange={(e) => setClosingDate(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="time"
                              name="registration-closing-time"
                              id="registration-closing-time"
                              value={closingTime || ""}
                              onChange={(e) => setClosingTime(e.target.value)}
                              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="options">
                  <div className="mt-6">
                    <div className="gap-x-2 space-y-4">
                      <div className="pb-2 -mt-2">
                        <label className="text-sm text-gray-900">
                          Accept registrations automatically?
                        </label>
                        <fieldset className="mt-2">
                          <legend className="sr-only">
                            Accept registrations automatically?
                          </legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                            <div className="flex items-center">
                              <input
                                id="yes"
                                name="registration-auto-accept"
                                type="radio"
                                checked={registrationAutoAccept === true}
                                onChange={() => setRegistrationAutoAccept(true)}
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
                                name="registration-auto-accept"
                                type="radio"
                                checked={registrationAutoAccept === false}
                                onChange={() =>
                                  setRegistrationAutoAccept(false)
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
                      <div className="pb-2 -mt-2">
                        <label className="text-sm text-gray-900">
                          Only allow permanent teams to register?
                        </label>
                        <fieldset className="mt-2">
                          <legend className="sr-only">
                            Only allow permanent teams to register?
                          </legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                            <div className="flex items-center">
                              <input
                                id="yes"
                                name="registration-permanent-team"
                                type="radio"
                                checked={registrationPermanentTeam === true}
                                onChange={() =>
                                  setRegistrationPermanentTeam(true)
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
                                id="no"
                                name="registration-permanent-team"
                                type="radio"
                                checked={registrationPermanentTeam === false}
                                onChange={() =>
                                  setRegistrationPermanentTeam(false)
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
                      <div className="pb-2 -mt-2">
                        <label className="text-sm text-gray-900">
                          Enable Organizer Notification Email?
                        </label>
                        <fieldset className="mt-2">
                          <legend className="sr-only">
                            Enable Organizer Notification Email?
                          </legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                            <div className="flex items-center">
                              <input
                                id="yes"
                                name="registration-notification"
                                type="radio"
                                checked={registrationNotification === true}
                                onChange={() =>
                                  setRegistrationNotification(true)
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
                                id="no"
                                name="registration-notification"
                                type="radio"
                                checked={registrationNotification === false}
                                onChange={() =>
                                  setRegistrationNotification(false)
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
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="customization">
                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-6">
                    <div className="space-y-4 lg:col-span-2">
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Form message
                        </label>
                        <textarea
                          rows={4}
                          name="form-message"
                          id="form-message"
                          value={registrationRequestMsg || ""}
                          onChange={(e) =>
                            setRegistrationRequestMsg(e.target.value)
                          }
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="">
                        <label
                          htmlFor="prize"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Validation message
                        </label>
                        <textarea
                          rows={4}
                          name="validation-message"
                          id="validation-message"
                          value={registrationAcceptMsg || ""}
                          onChange={(e) =>
                            setRegistrationAcceptMsg(e.target.value)
                          }
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="rules"
                          className="block text-sm leading-6 text-gray-900"
                        >
                          Refusal message
                        </label>
                        <textarea
                          rows={4}
                          name="refusal-message"
                          id="refusal-message"
                          value={registrationRefusalMsg || ""}
                          onChange={(e) =>
                            setRegistrationRefusalMsg(e.target.value)
                          }
                          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="pb-2 mt-2">
                      <label className="text-sm text-gray-900">
                        Add your own legal regulations?
                      </label>
                      <fieldset className="mt-2">
                        <legend className="sr-only">
                          Played on the internet?
                        </legend>
                        <div className="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                          <div className="flex items-center">
                            <input
                              id="yes"
                              name="legal-regulations"
                              type="radio"
                              checked={registrationTerms === true}
                              onChange={() => setRegistrationTerms(true)}
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
                              name="legal-regulations"
                              type="radio"
                              checked={registrationTerms === false}
                              onChange={() => setRegistrationTerms(false)}
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
                    <div className="col-span-1 mt-4">
                      <label
                        htmlFor="contact-email"
                        className="block text-sm leading-6 text-gray-900"
                      >
                        Regulations URL
                      </label>
                      <input
                        type="text"
                        name="regulations-url"
                        id="regulations-url"
                        value={registrationTermsUrl || ""}
                        onChange={(e) =>
                          setRegistrationTermsUrl(e.target.value)
                        }
                        className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                      />
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
