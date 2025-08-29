import { useConvexAuth } from "convex/react";
import React from "react";
import { Spinner } from "../../spinner";

const Notes = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) {
    return (
      <>
        <div className="h-full h-screen flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </>
    );
  }
  return <div className="">
    Document here
  </div>;
};

export default Notes;
