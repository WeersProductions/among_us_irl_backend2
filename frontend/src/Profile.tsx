import { profile } from "console";
import React from "react";
import { GameSettingButtons } from "./GameSettingButtons";

export interface ProfileData {
  name: string;
  wins: number;
  loses: number;
  isAdmin: boolean;
}

interface ProfileProps {
  profileData: ProfileData | null;
}

export const Profile = ({ profileData }: ProfileProps) => {
  const loading = profileData === null;
  return (
    <div>
      {loading && <p>Loading profile...</p>}
      {!loading && (
        <>
          <p>{profileData?.name}</p>
          <p>Wins: {profileData?.wins}</p>
          <p>Loses: {profileData?.loses}</p>
        </>
      )}
    </div>
  );
};
