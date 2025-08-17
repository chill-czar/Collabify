import SyncUser from "@/components/ui/SyncUser";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <SyncUser />
      {children}{" "}
    </div>
  );
};

export default layout;
