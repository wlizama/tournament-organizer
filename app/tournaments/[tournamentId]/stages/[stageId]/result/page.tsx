import prisma from "@/lib/prisma";
import { Stage } from "@prisma/client";
import { stageTypes } from "../../page";
import React from "react";

async function getStage(stageId: string) {
  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
    },
  });

  return stage;
}

interface Params {
  params: {
    // tournamentId: string;
    stageId: string;
  };
}

export default async function StageResult({ params }: Params) {
  const stage = await getStage(params.stageId);
  const bracket = createBracket(stage);
  const allMatches = bracket.reduce(
    (matches, round) => [...matches, ...round],
    []
  );
  const links = createLinks(bracket);

  return (
    <div
      className="relative flex flex-col bg-white text-left overflow-hidden rounded m-0"
      id="card"
    >
      <div className="p-5 border-b" id="card-header">
        <h2 className="text-2xl font-medium">{stageTypes[stage!.type].name}</h2>
      </div>
      <div className="flex-1 p-5 overflow-hidden break-words" id="card-content">
        {/* CARD */}
        <div className="block overflow-x-auto break-words">
          <div className="flex flex-wrap box-border min-w-max">
            {bracket.map((round, i) => (
              <div key={`round-${i}`} className="box-border min-w-0 mr-8">
                <div className="min-w-[12rem] p-3 bg-neutral-100 rounded">
                  <h2 className="text-sm font-bold text-center">
                    Round {i + 1}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex flex-wrap box-border w-[56rem]">
            {bracket.map((round, i) => (
              <div key={`round-${i}`} className="box-border min-w-0 mr-8">
                {round.map((match, j) => (
                  <div
                    key={`match-${j}`}
                    className="flex items-center"
                    style={{
                      left: match.left,
                      top: match.top,
                      width: "12rem",
                      height: "3.875rem",
                    }}
                  >
                    Match {j + 1} ({match.name})
                  </div>
                ))}
              </div>
            ))}
          </div> */}
          <div
            className="relative block"
            style={{
              width: bracket.length * 14 + "rem",
              height: bracket[0].length * 5 + "rem",
            }}
          >
            <div className="absolute z-[1] block" id="bracket-nodes">
              {allMatches.map((match, i) => (
                <div
                  key={`match-${i}`}
                  className="box-border min-w-0 mr-8 absolute"
                  style={{
                    left: match.left,
                    top: match.top,
                    width: "12rem",
                    height: "3.875rem",
                  }}
                >
                  <div className="flex relative box-border min-w-[12rem] p-2 rounded border border-neutral-300">
                    <div
                      className="flex absolute -top-2 left-2 right-2 z-[1] text-xs"
                      id="header"
                    >
                      <div className="text-ellipsis overflow-hidden whitespace-nowrap bg-white px-1 mb-2 text-neutral-500">
                        {match.name}
                      </div>
                    </div>
                    <div
                      className="flex-[3_1_0%] block text-neutral-300 text-sm"
                      id="record"
                    >
                      <div className="flex items-center mb-[1px]">
                        <div className="">Team A</div>
                      </div>
                      <div className="flex items-center mb-0">
                        <div className="">Team B</div>
                      </div>
                    </div>
                    <div className="" id="state disabled"></div>
                  </div>
                </div>
              ))}
            </div>
            <svg
              className="absolute z-0 overflow-hidden w-full h-full"
              x={0}
              y={0}
              viewBox={`0 0 ${bracket.length * 14000} ${
                bracket[0].length * 5000
              }`}
              id="bracket-links"
            >
              {links.map((points, i) => (
                <polyline
                  key={`link-${i}`}
                  className="fill-none stroke-[62.5] stroke-neutral-300"
                  points={points}
                  fill="none"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function createBracket(stage: Stage | null) {
  // @ts-ignore
  const size = stage.settings.size;
  const rounds = Math.log2(size);
  const bracket = [];

  let offsets = [1.375, 3.6875, 8.3125, 17.5625, 36.0625];
  let offset = 1.375;
  // let offset = 1.85;
  for (let i = 0; i < rounds; i++) {
    const round = [];
    const matches = Math.pow(2, rounds - i - 1);
    const multiplier = Math.pow(2, i);
    for (let j = 0; j < matches; j++) {
      let name;
      if (i === rounds - 2 && matches === 2) {
        name = `Semi ${j + 1}`;
      } else if (i === rounds - 1 && matches === 1) {
        name = `Final`;
      } else {
        name = `M.${i + 1}.${j + 1}`;
      }
      const nextMatchIndex = Math.floor(j / 2);
      round.push({
        match: [],
        winner: null,
        name,
        nextMatchIndex,
        left: `${14 * i}rem`,
        // top: `${j * multiplier * 4.625 + offsets[i]}rem`,
        top: `${j * multiplier * 4.625 + offset}rem`,
      });
    }
    bracket.push(round);

    // Update offset for next round
    offset += (4.625 * multiplier) / 2;
  }

  return bracket;
}

function createLinks(bracket: any) {
  const links = [];
  const matchWidth = 14;

  for (let i = 0; i < bracket.length - 1; i++) {
    const round = bracket[i];
    const nextRound = bracket[i + 1];

    for (let j = 0; j < round.length; j++) {
      const match = round[j];
      const nextMatch = nextRound[match.nextMatchIndex];

      // Skip if there's no next match
      if (!nextMatch) continue;

      // Convert rem to unitless numbers for SVG
      const x1 = i * matchWidth * 1000 + 12000;
      const x2 = (i + 1) * matchWidth * 1000 - 1000;
      const y1 = (parseFloat(match.top) + 1.9375) * 1000;
      const y2 = (parseFloat(nextMatch.top) + 1.9375) * 1000;
      const x3 = (i + 1) * matchWidth * 1000;

      // Create link
      const link = `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x3},${y2}`;
      links.push(link);
    }
  }

  return links;
}
