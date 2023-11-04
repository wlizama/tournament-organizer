interface ParticipantSettingsLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: 'Configuración de registro',
}

export default async function ParticipantSettingsLayout({
  children,
}: ParticipantSettingsLayoutProps) {
  return <>{children}</>
}
