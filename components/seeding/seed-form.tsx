"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbCheck, TbPencil, TbPlus, TbX } from "react-icons/tb";
import TeamSelectModal from "./team-select-modal";

interface Props {
  numSeeds: number;
  participants: Participant[];
  stageId: string;
  seeds: any;
}

interface Participant {
  id: string;
  name: string;
  created_at: Date;
}

export default function SeedForm({
  numSeeds,
  participants,
  stageId,
  seeds,
}: Props) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm();
  const onSubmit = async (seeding: any) => {
    try {
      const body = { stageId, seeding };
      const res = await fetch(`/api/matches`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error("Error submitting seeding data: ", error);
    }
  };

  const [seededParticipants, setSeededParticipants] = useState<
    (Participant | null)[]
  >(Array(numSeeds).fill(null));
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentSeedIndex, setCurrentSeedIndex] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Participant | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit"));
    }
  };

  useEffect(() => {
    setSeededParticipants(seeds);
  }, [seeds]);

  const handleOpenModal = (index: number) => {
    setCurrentSeedIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTeam(null);
  };

  const handleSelectTeam = (team: Participant) => {
    setSelectedTeam(team);
  };

  const handleAdd = () => {
    if (currentSeedIndex !== null && selectedTeam) {
      const newSeededParticipants = [...seededParticipants];
      const index = newSeededParticipants.findIndex(
        (p) => p && p.id === selectedTeam.id
      );
      if (index !== -1) {
        newSeededParticipants[index] = null;
      }
      newSeededParticipants[currentSeedIndex] = selectedTeam;
      setSeededParticipants(newSeededParticipants);
      handleCloseModal();
    }
  };

  const handleRemove = (index: number) => {
    const newSeededParticipants = [...seededParticipants];
    newSeededParticipants[index] = null;
    setSeededParticipants(newSeededParticipants);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(() =>
        // onSubmit(seededParticipants.filter(Boolean) as Participant[])
        onSubmit(seededParticipants)
      )}
    >
      {/* CARD CONTENT */}
      <div className="flex-1 p-5 overflow-auto break-words border-b">
        <div className="flex flex-wrap flex-col m-0 text-sm">
          <div className="block min-w-[7rem]">
            <div className="flex items-center min-h-[1rem] p-1 cursor-pointer border-b">
              <div className="text-center w-8">#</div>
              <div className="ml-1 w-8"></div>
              <div className="flex-[10_1_0%] text-left w-0 ml-1 overflow-ellipsis whitespace-nowrap">
                Name
              </div>
              <div className="w-14"></div>
            </div>

            {seededParticipants.map((seededParticipant, index) => (
              <div
                key={index}
                className="flex items-center min-h-[35px] p-1 border-b"
              >
                <div className="box-content ml-0 w-8 text-center">
                  {index + 1}
                </div>
                {seededParticipant ? (
                  <>
                    <div className="block box-content ml-1">
                      <button
                        type="button"
                        className="py-0 text-center w-8 align-middle"
                        onClick={() => handleOpenModal(index)}
                      >
                        <TbPencil className="h-5 w-5 ml-2 text-blue-500 stroke-2" />
                      </button>
                    </div>
                    <div className="flex-[10_1_0%] text-left w-0 ml-1 overflow-ellipsis whitespace-nowrap box-content">
                      {seededParticipant.name}
                    </div>
                    <div className="box-content ml-1">
                      <button
                        type="button"
                        className="py-0 text-center align-middle"
                        onClick={() => handleRemove(index)}
                      >
                        <TbX className="h-5 w-5 ml-2 stroke-2" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="block box-content ml-1">
                    <button
                      type="button"
                      className="py-0 text-center w-8 align-middle"
                      onClick={() => handleOpenModal(index)}
                    >
                      <TbPlus className="h-5 w-5 ml-2 text-green-500 stroke-2" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button type="submit">Seed Teams</button>
            {isSubmitting && <div className="">(...saving)</div>}
            {isSubmitSuccessful && (
              <>
                <div className="text-green-500 font-bold">SAVED!</div>
                {/* <div className="ml-4">OK</div> */}
                <button className="" onClick={() => reset()}>
                  OK
                </button>
              </>
            )}

            {modalVisible && (
              <TeamSelectModal
                participants={participants}
                handleAdd={handleAdd}
                handleCloseModal={handleCloseModal}
                selectedTeam={selectedTeam}
                handleSelectTeam={handleSelectTeam}
                open={modalVisible}
                setOpen={setModalVisible}
                seededParticipants={seededParticipants}
              />
            )}
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <div className="block p-4">
        <div className="flex flex-wrap box-border justify-end">
          <button
            type="submit"
            className="flex justify-center rounded-md bg-[#111] px-3 py-2 text-white shadow-sm hover:bg-[#333]"
          >
            <div className="flex items-center gap-2">
              <TbCheck className="h-5 w-5" />
              Save
            </div>
          </button>
        </div>
      </div>
    </form>
  );
}
