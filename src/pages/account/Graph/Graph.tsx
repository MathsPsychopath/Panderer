import { useAuth } from "@clerk/clerk-react";
import { signInWithCustomToken } from "firebase/auth";
import React, { useCallback } from "react";
import { PrimaryButton } from "../../../components/common/Buttons";
import { auth, functions } from "../../../firebase";
import { httpsCallable } from "firebase/functions";

export default function Graph() {
  // Check that they haven't already started a polling instance
  // if started, then render the poll, graph, browser source
  // If not started, then render button to start
  // On start, set Started, then add all their data to rtdb, profile pic url, title
  // generate a link, do "started"
  // const {getToken} = useAuth()
  // const handleStart = useCallback(async () => {
  //   const token = await getToken({template: "firebase"})
  //   const auth = getAuth()
  //   // signInWithCustomToken(auth, token)
  // }, [])
  const { getToken } = useAuth();
  const handleSubmit = useCallback(async () => {
    try {
      const token = await getToken({ template: "integration_firebase" });
      console.log(token);
      if (!token) throw new Error();
      await signInWithCustomToken(auth, token);
      console.log("authenticated");
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleLivePoll = useCallback(async () => {
    const token = await getToken({ template: "integration_firebase" });
    const livePoll = httpsCallable(functions, "livePoll");
    livePoll({ pollID: "nOJko63xSe9bJyijtnPI", method: "GET" })
      .then((e) => console.log(e))
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
      <PrimaryButton onClick={handleSubmit}>Auth</PrimaryButton>
      <PrimaryButton onClick={handleLivePoll}>livePoll</PrimaryButton>
    </>
  );
}
