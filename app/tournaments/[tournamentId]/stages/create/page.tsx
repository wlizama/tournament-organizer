/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaUserFriends, FaUsers } from "react-icons/fa";

import { DoubleEliminationConfig } from "@/components/stages/stage-type-configs/double-elimination";
import { SingleEliminationConfig } from "@/components/stages/stage-type-configs/single-elimination";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { GauntletConfig } from "@/components/stages/stage-type-configs/gauntlet";

async function getStages(id: string) {
  return await prisma.stage.findMany({
    where: {
      tournamentId: id,
    },
    orderBy: {
      number: "asc",
    },
  });
}

const duelStageTypes = [
  {
    name: "single_elimination",
    verboseName: "Single Elimination",
    description: "Bracket in which participants are eliminated after one loss.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_single_elimination.svg?1686061578",
  },
  {
    name: "double_elimination",
    verboseName: "Double Elimination",
    description:
      "Bracket in which participants must lose twice to get eliminated.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_double_elimination.svg?1686903689",
  },
  {
    name: "gauntlet",
    verboseName: "Gauntlet",
    description:
      "Bracket in which participants of lower seed play progressively against opponents of higher seed.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_gauntlet.svg?1686903689",
  },
  {
    name: "bracket_groups",
    verboseName: "Bracket Groups",
    description:
      "Groups in which participants play in small single or double elimination brackets.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_bracket_groups.svg?1686903689",
  },
  {
    name: "pools",
    verboseName: "Round-robin Groups",
    description:
      "Small groups in which participants play against every other player from their group.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_pools.svg?1686903689",
  },
  {
    name: "league",
    verboseName: "League",
    description:
      "Large divisions in which participants play against every other participant from their division.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_league.svg?1686903689",
  },
  {
    name: "swiss",
    verboseName: "Swiss System",
    description:
      "Stage in which participants will play against opponents closest to their skill level.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_swiss.svg?1686903689",
  },
];

const ffaStageTypes = [
  {
    name: "simple",
    verboseName: "Simple",
    description: "Stage containing a single round of matches.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_simple.svg?1686903689",
  },
  {
    name: "ffa_single_elimination",
    verboseName: "FFA Single Elimination",
    description:
      "Bracket with matches where a set number of participants qualifies for the next round.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_ffa_single_elimination.svg?1686903689",
  },
  {
    name: "ffa_bracket_groups",
    verboseName: "FFA Bracket Groups",
    description:
      "Groups in which particpants play free-for-all matches in single-elimination brackets.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_ffa_bracket_groups.svg?1686903689",
  },
  {
    name: "ffa_league",
    verboseName: "FFA League",
    description:
      "Divisions in which participants earn points in matches for a ranking.",
    imgUrl:
      "https://organizer.toornament.com/structures/icon_ffa_league.svg?1686903689",
  },
];

interface Params {
  params: {
    tournamentId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CreateStage({ params, searchParams }: Params) {
  const stages = await getStages(params.tournamentId);
  const tournamentId = params.tournamentId;
  const matchType = searchParams.match_type;
  const stageType = searchParams.stage_type;
  const stage = null;

  if (matchType === "duel") {
    return (
      <div className="">
        <div className="relative my-10">
          <h1 className="text-3xl font-semibold">Select a Stage Type</h1>
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
        >
          {duelStageTypes.map((stage) => (
            <Link
              key={stage.name}
              href={`/tournaments/${params.tournamentId}/stages/create?stage_type=${stage.name}`}
              className="col-span-1 flex flex-col rounded bg-white text-left shadow justify-center hover:ring-2 hover:ring-neutral-600"
            >
              <li>
                <div className="flex flex-1 flex-col p-5">
                  <Image
                    className="mx-auto h-32 w-32 flex-shrink-0"
                    src={stage.imgUrl}
                    width={128}
                    height={128}
                    alt=""
                  />
                  <h3 className="mt-6 text-xl font-medium text-gray-900">
                    {stage.verboseName}
                  </h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Stage Type</dt>
                    <dd className="text-gray-500">{stage.description}</dd>
                  </dl>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  }

  if (matchType === "ffa") {
    return (
      <div className="">
        <div className="relative my-10">
          <h1 className="text-3xl font-semibold">Select a Stage Type</h1>
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
        >
          {ffaStageTypes.map((stage) => (
            <Link
              key={stage.name}
              href={`/tournaments/${params.tournamentId}/stages/create?stage_type=${stage.name}`}
              className="col-span-1 flex flex-col rounded bg-white text-left shadow justify-center hover:ring-2 hover:ring-neutral-600"
            >
              <li>
                <div className="flex flex-1 flex-col p-5">
                  <Image
                    className="mx-auto h-32 w-32 flex-shrink-0"
                    src={stage.imgUrl}
                    width={128}
                    height={128}
                    alt=""
                  />
                  <h3 className="mt-6 text-xl font-medium text-gray-900">
                    {stage.verboseName}
                  </h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Stage Type</dt>
                    <dd className="text-gray-500">{stage.description}</dd>
                  </dl>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  }

  if (stageType === "single_elimination") {
    return (
      <SingleEliminationConfig
        stage={stage}
        stages={stages}
        tournamentId={tournamentId}
      />
    );
  }

  if (stageType === "double_elimination") {
    return (
      <DoubleEliminationConfig
        stage={stage}
        stages={stages}
        tournamentId={tournamentId}
      />
    );
  }

  if (stageType === "gauntlet") {
    return (
      <GauntletConfig
        stage={stage}
        stages={stages}
        tournamentId={tournamentId}
      />
    );
  }

  if (stageType === "bracket_groups") {
    return <>bracket groups config</>;
  }

  if (stageType === "pools") {
    return <>round-robin groups config</>;
  }

  if (stageType === "league") {
    return <>league config</>;
  }

  if (stageType === "swiss") {
    return <>swiss system config</>;
  }

  if (stageType === "simple") {
    return <>simple config</>;
  }

  if (stageType === "ffa_single_elimination") {
    return <>ffa single elimination config</>;
  }

  if (stageType === "ffa_bracket_groups") {
    return <>ffa bracket groups config</>;
  }

  if (stageType === "ffa_league") {
    return <>ffa league config</>;
  }

  return (
    <div className="">
      <div className="relative my-10">
        <h1 className="text-3xl font-semibold">Select a Match Type</h1>
      </div>
      <ul role="list" className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <Link
          href={`/tournaments/${params.tournamentId}/stages/create?match_type=duel`}
          className="col-span-1 flex flex-col rounded bg-white text-center shadow justify-center hover:ring-2 hover:ring-neutral-600"
        >
          <li>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex">
                <div className="hidden sm:flex mr-4 p-8 flex-shrink-0 self-center">
                  <FaUserFriends className="h-16 w-16 text-neutral-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-2xl font-medium">Duel</h4>
                  <p className="mt-1">
                    Matches involving two participants (either two players or
                    two teams) require a structure using duel-based stages such
                    as single or double elimination, gauntlet, round-robin or
                    swiss system.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </Link>
        <Link
          href={`/tournaments/${params.tournamentId}/stages/create?match_type=ffa`}
          className="col-span-1 flex flex-col rounded bg-white text-center shadow justify-center hover:ring-2 hover:ring-neutral-600"
        >
          <li>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex">
                <div className="hidden sm:flex mr-4 p-8 flex-shrink-0 self-center">
                  <FaUsers className="h-16 w-16 text-neutral-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-2xl font-medium">FFA</h4>
                  <p className="mt-1">
                    Matches involving more than two participants, usually called
                    Free-For-All (FFA) matches require a strucutre using stages
                    specifically designed for FFA.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
}
