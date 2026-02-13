"use client";

import { useEffect, useState } from "react";
import Loader from "../homeScreenLoader";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loader runs only once — on page load or refresh
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // adjust time as you prefer

    return () => clearTimeout(timeout);
  }, []); 

  if (!loading) return null;

  return (
        <div className="h-screen w-screen -translate-y-20">
            {/* <Loader /> */}
            <div className="flex items-center justify-center h-screen">
      <Loader />
      {/* Custom version */}
      {/* <Loader size={80} color="tomato" borderWidth={10} /> */}
    </div>
        </div>
    );
}


