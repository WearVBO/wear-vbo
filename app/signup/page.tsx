"use client";
import { SignupComponent } from "@/exports/exports";
import {Suspense} from "react"

export default function page() {
  <Suspense fallback={<div>Loading...</div>}>

  <SignupComponent />;
  </Suspense>
}