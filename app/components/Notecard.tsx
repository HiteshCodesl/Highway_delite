"use client"
import { Beer, Currency } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Note } from "./Hero";

export function Notecard({note, onNoteDelete}: {note: Note, onNoteDelete: (id: string) => void}) { 
  
  const [deleteDialog, setDeleteDialog] = useState(false);

 const handleDeleteNote = async() => {
      const id = note.id;
      console.log(id, "noteID")
     const response = await axios.delete("/api/notes", { data: id})
     if(response){
       console.log('note is deleted')
       onNoteDelete(response.data.id)
       setDeleteDialog(false);
     }
 }

  return (
        <div>  
        
            <div
              className="border p-3 rounded-xl shadow-md mt-3 flex justify-between"
            >
              <p className="text-black w-52 md:w-[500px] max-w-screen-md">{note.content}</p>
              <Beer onClick={() =>{ 
                setDeleteDialog(true)
                }} />
            </div>

            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Are you absolutely sure?</DialogTitle>
                 <DialogDescription>
                   This action cannot be undone. This will permanently delete
                 </DialogDescription>
                 <Button onClick={handleDeleteNote} variant={'destructive'}>Delete</Button>
               </DialogHeader>
             </DialogContent>
            </Dialog>
               
        </div>
  )
}

