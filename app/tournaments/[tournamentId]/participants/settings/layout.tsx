interface ParticipantSettingsLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Registration Settings",
};

export default async function ParticipantSettingsLayout({
  children,
}: ParticipantSettingsLayoutProps) {
  return <>{children}</>;
}
