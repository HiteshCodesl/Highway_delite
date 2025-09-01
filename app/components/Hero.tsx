"use client"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Notes } from "./Notes";
import axios from "axios";
import {  Notecard } from "./Notecard";

export type Note = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export function Hero() {
  const {data: session,status} = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const {data} = useSession();    
  const [notes, setNotes] = useState<Note[]>([])

  const name = data?.user?.name;
  const email = data?.user?.email;

  useEffect(()=>{
  if(status === "authenticated"){
    const GetNotes = async () => {
      const response = await axios.get("/api/notes");

      if(response.status === 200){
          console.log(response.data);
          setNotes(response.data);
      }
    }
    GetNotes();
  }
}, [])

  const handleNoteAdded = (newNote: Note) => {
    setNotes((prev) => [...prev, newNote]); 
  };

  const handleNoteDelete = (deleteNote: string) => {
    setNotes(notes.filter(note => note.id !== deleteNote))
  }

  return (
    <div className="flex flex-col items-center justify-center">

    <div className="mt-18 border p-6 rounded-xl shadow-xl w-[300px] md:w-[500px] lg:w[700px] max-w-screen-lg">
      <h2 className="text-bold text-2xl font-bold">Welcome, {name}</h2>
      <p className="mt-4 text-lg font-semibold">Email: {email}</p>

     </div>

     <div className="mt-6 w-full px-14 flex justify-center">
       <Button disabled={status === 'unauthenticated'}
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white w-[300px] md:w-[500px] lg:w[700px] max-w-screen-lg"
        >
          Create Note
        </Button>
      </div>

      <Notes isOpen={isOpen} setIsOpen={setIsOpen} onNoteAdded={handleNoteAdded} />
      <p className="text-xl font-semibold mt-10">Notes</p>
      {notes.map((note)=>(
        <Notecard key={note.id} note={note} onNoteDelete={handleNoteDelete}/>
      ))}
    
    </div>
  )
}

