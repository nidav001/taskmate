import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { View } from "../types/enums";

interface ViewState {
  view: View;
  currentCollaborator: string;
  setCurrentCollaborator: (email: string) => void;
  collaboratorEmails: string[];
  setCollaboratorEmails: (emails: string[]) => void;
  setView: (newView: View) => void;
}

const useViewStore = create<ViewState>()(
  devtools(
    persist(
      (set) => ({
        view: View.Regular,
        setView: (newView) => {
          set(() => {
            return { view: newView };
          });
        },
        currentCollaborator: "",
        setCurrentCollaborator: (email) => {
          set(() => {
            return { currentCollaborator: email };
          });
        },
        collaboratorEmails: [],
        setCollaboratorEmails: (emails) => {
          set(() => {
            return { collaboratorEmails: emails };
          });
        },
      }),
      {
        name: "view-storage-v1",
      }
    )
  )
);

export default useViewStore;
