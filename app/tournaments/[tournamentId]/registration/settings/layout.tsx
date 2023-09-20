interface RegistrationSettingsLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Registration Settings",
};

export default async function RegistrationSettingsLayout({
  children,
}: RegistrationSettingsLayoutProps) {
  return <>{children}</>;
}
