import HomeNav from '@/components/home/HomeNav'
import HomeFooter from '@/components/home/HomeFooter'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HomeNav />
      <main className="flex-1">{children}</main>
      <HomeFooter />
    </>
  )
}
