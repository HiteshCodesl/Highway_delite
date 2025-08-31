"use client"
import axios from "axios";
import { Beer } from "lucide-react";
import { useEffect, useState } from "react";

export type Note = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

interface Props {
  note: Note;
}

export function Notecard({note}: Props) { 
 console.log(note)
  return (
        <div>
             <h1 className="text-xl font-semibold">(note)</h1>
          
            <div
              className="border p-3 rounded-xl shadow-md mt-3 flex justify-between"
            >
              <p className="text-black">{note.content}</p>
              <Beer />
            </div>
        </div>
     
  )
}

