"use client"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Notes } from "./Notes";
import axios from "axios";
import { Note, Notecard } from "./Notecard";

export function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const {data} = useSession();    
  const [notes, setNotes] = useState<Note[]>([]);
  const name = data?.user?.name;
  const email = data?.user?.email;

  useEffect(()=>{
    const GetNotes = async () => {
      const response = await axios.get("/api/notes");

      if(response.status === 200){
          console.log(response.data);
          setNotes(response.data);
      }
    }
    GetNotes();
  }, [])

  const handleNoteAdded = (newNote: Note) => {
    setNotes((prev) => [...prev, newNote]); 
  };

  return (
    <div className="flex flex-col items-center justify-center">

    <div className="mt-18 border p-6 rounded-xl shadow-xl">
      <h2 className="text-bold text-2xl font-bold">Welcome, {name}</h2>
      <p className="mt-4 text-lg font-semibold">Email: {email}</p>

     </div>

     <div className="mt-6 w-full px-14 flex justify-center">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white w-[80vw]"
        >
          Create Note
        </Button>
      </div>

      <Notes isOpen={isOpen} setIsOpen={setIsOpen} onNoteAdded={handleNoteAdded} />
        {notes.map((note) =>(
            <Notecard key={note.id} note={note}/>
      ))} 
    </div>
    
  )
}

