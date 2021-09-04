import React from "react";

interface LoginProps {
  username: string;
  onNameChange: (input: string) => void;
  onNameConfirm: () => void;
  awaitingInput: boolean;
}

export const Login = ({
  username,
  onNameChange,
  onNameConfirm,
  awaitingInput,
}: LoginProps) => {
  const existingName = localStorage.getItem("name") || "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNameConfirm();
      }}
    >
      <div style={{ display: "flex" }}>
        <label htmlFor="username">Name: </label>
        <input
          disabled={awaitingInput}
          type="text"
          id="username"
          name="Username"
          value={username}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>
      <button
        style={{ display: "block", width: "100%", height: 40, marginTop: 18 }}
        type="submit"
      >
        CONNECT!
      </button>
    </form>
  );
};
