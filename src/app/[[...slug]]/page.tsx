"use server";
import { JSX } from "react"
import PlanetApp from "@/PlanetApp";
import VehicleApp from "@/VehicleApp";
import {VignetteApp} from "@/VignetteApp"
import Link from "next/link";
const navLinkStyle = "m-4 rounded p-2 hover:underlined bg-green-800 hover:bg-green-600"
export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const navLinks = [
    {
      slug: "planet",
      name: "Planet",
      Component: PlanetApp
    },
    {
      slug: "vehicle-physics",
      name: "Vehicle Physics",
      Component: VehicleApp
    },
    {
      slug: "world",
      name: "Vignette World",
      Component: VignetteApp
    },
  ]
  const slugsToComponents = Object.fromEntries(navLinks.map(({ slug, Component }) => {
    return [slug, Component]
  }))
  const Component = slugsToComponents[slug]
  if (Component) {
    return (
      <Component />
    );
  }
  return <main>
    <h1>Choose a demo</h1>
    <nav className="flex flex-col">{
      navLinks.map(({name: title, slug: url}) => {
        const r = Math.floor(Math.random()*256)
        const g = Math.floor(Math.random()*256)
        const b = Math.floor(Math.random()*256)
        const className = `${navLinkStyle} text-shadow-lg`
        return <span key={"/"+url} className="m-1 p-2 mt-6">
          <Link
        style={{
          backdropFilter: `contrast(0.5)`,
          color: `rgb(${r>128 ? 0 : 255},${g>128 ? 0 : 255},${b>128 ? 0 : 255})`,
          backgroundColor: `rgb(${r},${g},${b})`
        }}
        className={className} href={"/"+url}>{title}</Link></span>
      })
    }</nav>
  </main>
}
