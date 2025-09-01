import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import {Notecard} from "./components/Notecard";

export default function Home() {
  return (
    <div className="mt-10 mx-3">
    <Header />
    <Hero />
    <div className="mt-10 mx-3 ">
    </div>
    </div>
  );
}
