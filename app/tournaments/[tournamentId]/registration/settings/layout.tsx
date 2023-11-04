interface RegistrationSettingsLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: 'Configuración de registro',
}

export default async function RegistrationSettingsLayout({
  children,
}: RegistrationSettingsLayoutProps) {
  return <>{children}</>
}
