// page for entering game pin which will redirect to lobby page
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const GamePinPage = () => {
  const [gamePin, setGamePin] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to lobby page with the entered game pin
    router.push(`/play/lobby?gamePin=${gamePin}`);
  };

  return (
    <div>
      <h1>Enter Game Pin</h1>
      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Enter Game Pin"
          type="text"
          value={gamePin}
          onChange={(e) => setGamePin(e.target.value)}
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
};

export default GamePinPage;
