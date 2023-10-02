// import TournamentNavigation from "@/components/navigation/tournament-navigation";
// import SidebarNavigation from "@/components/navigation/tournament-navigation";

interface TournamentsLayoutProps {
  children: React.ReactNode;
}

export default function TournamentsLayout({
  children,
}: TournamentsLayoutProps) {
  return (
    <>
      <div>
        {/* <TournamentNavigation />

        <main className="absolute xl:pl-72 top-16 xl:top-0 right-0 bottom-0 left-0">
          <div className="h-full px-4 pb-4 sm:px-6 sm:pb-6 xl:px-10 xl:pb-10 overflow-y-scroll overflow-x-auto">
            {children}
          </div>
        </main> */}
        {children}
      </div>
    </>
  );
}
