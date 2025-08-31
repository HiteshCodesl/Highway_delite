"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Props{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNoteAdded: (note: any) => void;
}

export function Notes({isOpen, setIsOpen, onNoteAdded}: Props) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNoteAdd = async() =>{
     try{
        setLoading(true);
       const response = await axios.post("/api/notes", {content});

       if(response){
         onNoteAdded(response.data); 
         
         setIsOpen(false);
         setContent('');
       }

    }catch(error){
        console.log("Error adding note:", error);
        
    }finally{
      setLoading(false);
    }

    }

  return (
    <div>
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-center font-bold text-blue-600">Add a New Note</DialogTitle>
          <p className="text-lg font-semibold">Add a Content</p>

          <Input className="text-lg font-semibold" value={content} onChange={(e) => setContent(e.target.value)} type="text"/>

          <Button className="bg-gradient-to-r from-blue-600 to-sky-600" onClick={handleNoteAdd} >Add Note{loading ? <Loader2 /> : <ArrowRight />} </Button>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

