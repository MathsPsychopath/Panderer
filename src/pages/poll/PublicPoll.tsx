import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

function Poll({ pollId }: { pollId: string }) {
  const [data, setData] = useState([]);

  // need to check db if pollid exists, then get data, profile, title
  // create 3 buttons for updating the value,
  // add listener to subscribe to updates to data, appending it to data points list
  // add different types of graphs
  return <></>;
}

export default function PublicPoll() {
  const { pollId } = useParams();
  return <>{pollId ? <Poll pollId={pollId} /> : <Navigate to="/" />}</>;
}
