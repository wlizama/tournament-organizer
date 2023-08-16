"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbPencil, TbPlus, TbX } from "react-icons/tb";
import TeamSelectModal from "./team-select-modal";

interface Props {
  numSeeds: number;
  participants: Participant[];
}

interface Participant {
  id: string;
  name: string;
  created_at: Date;
}

export default function SeedForm({ numSeeds, participants }: Props) {
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);

  const [seededParticipants, setSeededParticipants] = useState<
    (Participant | null)[]
  >(Array(numSeeds).fill(null));
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentSeedIndex, setCurrentSeedIndex] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Participant | null>(null);

  console.log(seededParticipants);

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

        <form
          onSubmit={handleSubmit(() =>
            onSubmit(seededParticipants.filter(Boolean) as Participant[])
          )}
        >
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
        </form>
      </div>
    </div>
  );
}
