/*
Copyright 2022 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Link } from "react-router-dom";
import { MatrixClient } from "matrix-js-sdk/src/client";
import { RoomMember } from "matrix-js-sdk/src/models/room-member";
import { Room } from "matrix-js-sdk/src/models/room";
import { FC } from "react";

import { CopyButton } from "../button";
import { Avatar, Size } from "../Avatar";
import styles from "./CallList.module.css";
import { getAbsoluteRoomUrl, getRelativeRoomUrl } from "../matrix-utils";
import { Body } from "../typography/Typography";
import { GroupCallRoom } from "./useGroupCallRooms";
import { useRoomSharedKey } from "../e2ee/sharedKeyManagement";

interface CallListProps {
  rooms: GroupCallRoom[];
  client: MatrixClient;
}

export const CallList: FC<CallListProps> = ({ rooms, client }) => {
  return (
    <>
      <div className={styles.callList}>
        {rooms.map(({ room, roomName, avatarUrl, participants }) => (
          <CallTile
            key={room.roomId}
            client={client}
            name={roomName}
            avatarUrl={avatarUrl}
            room={room}
            participants={participants}
          />
        ))}
        {rooms.length > 3 && (
          <>
            <div className={styles.callTileSpacer} />
            <div className={styles.callTileSpacer} />
          </>
        )}
      </div>
    </>
  );
};
interface CallTileProps {
  name: string;
  avatarUrl: string;
  room: Room;
  participants: RoomMember[];
  client: MatrixClient;
}

const CallTile: FC<CallTileProps> = ({ name, avatarUrl, room }) => {
  const roomSharedKey = useRoomSharedKey(room.roomId);

  return (
    <div className={styles.callTile}>
      <Link
        // note we explicitly omit the password here as we don't want it on this link because
        // it's just for the user to navigate around and not for sharing
        to={getRelativeRoomUrl(room.roomId, room.name)}
        className={styles.callTileLink}
      >
        <Avatar id={room.roomId} name={name} size={Size.LG} src={avatarUrl} />
        <div className={styles.callInfo}>
          <Body overflowEllipsis fontWeight="semiBold">
            {name}
          </Body>
        </div>
        <div className={styles.copyButtonSpacer} />
      </Link>
      <CopyButton
        className={styles.copyButton}
        variant="icon"
        value={getAbsoluteRoomUrl(
          room.roomId,
          room.name,
          roomSharedKey ?? undefined
        )}
      />
    </div>
  );
};
