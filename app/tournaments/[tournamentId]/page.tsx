import Link from "next/link";

interface Params {
  params: {
    tournamentId: string;
  };
}

export default function Tournament({ params }: Params) {
  return (
    <div className="">
      <div className="relative my-10">
        <h1 className="text-3xl font-semibold">Overview</h1>
      </div>
      <div className="font-medium space-y-2">
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/settings`}
            className="underline"
          >
            Settings
          </Link>
        </div>
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/stages`}
            className="underline"
          >
            Structure
          </Link>
        </div>
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/placement`}
            className="underline"
          >
            Placement
          </Link>
        </div>
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/matches`}
            className="underline"
          >
            Matches
          </Link>
        </div>
      </div>
    </div>
  );
}
