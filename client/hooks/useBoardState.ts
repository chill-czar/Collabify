import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Custom hook to manage board state
 * Decouples components from direct Redux dependency
 */
export function useBoardState() {
  const currentBoardId = useSelector(
    (state: RootState) => state.currentBoard.currentBoardId
  ) as Id<"board"> | null;

  return {
    currentBoardId,
  };
}
