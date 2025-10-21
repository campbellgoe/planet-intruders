"use server";
import { JSX } from "react"
import PlanetApp from "@/PlanetApp";
import VehicleApp from "@/VehicleApp";
import Link from "next/link";
const navLinkStyle = "m-4 rounded p-2 hover:underlined bg-green-800 hover:bg-green-600"
export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const navLinks = [
    ["Planet", "/planet"],
    ["Vehicle Physics", "/vehicle-physics"]
  ]
  const slugToComponent: { [key: string]: () => JSX.Element } = {
    'planet': PlanetApp,
    'vehicle-physics': VehicleApp
  }
  const Component = slug in slugToComponent && slugToComponent[slug]
  if (Component) {
    return (
      <Component />
    );
  }
  return <main>
    <h1>Choose a demo</h1>
    <nav className="flex flex-col">{
      navLinks.map(([title, url]) => {
        const r = Math.floor(Math.random()*256)
        const g = Math.floor(Math.random()*256)
        const b = Math.floor(Math.random()*256)
        const className = `${navLinkStyle} text-shadow-lg`
        return <span key={url} className="m-1 p-2 mt-6">
          <Link
        style={{
          backdropFilter: `contrast(0.5)`,
          color: `rgb(${r>128 ? 0 : 255},${g>128 ? 0 : 255},${b>128 ? 0 : 255})`,
          backgroundColor: `rgb(${r},${g},${b})`
        }}
        className={className} href={url}>{title}</Link></span>
      })
    }</nav>
  </main>
}
