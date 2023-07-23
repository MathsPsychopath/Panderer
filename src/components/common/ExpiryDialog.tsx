import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { PrimaryButton, SecondaryButton } from "./Buttons";

interface IExpiredDialog {
  isDialogOpen: boolean;
  onDialogClose: () => void;
  isPublic?: boolean;
}

export function ExpiryDialog({
  isDialogOpen,
  onDialogClose,
  isPublic,
}: IExpiredDialog) {
  return (
    <Dialog open={isDialogOpen} onClose={onDialogClose}>
      <DialogTitle>Poll expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isPublic
            ? "This poll has expired. Thanks for voting with Panderer!"
            : "This poll has expired. Consider giving feedback or petitioning for longer polls:"}
        </DialogContentText>
        <Box className="mt-4 flex justify-end gap-4">
          <SecondaryButton onClick={onDialogClose}>Close</SecondaryButton>
          <PrimaryButton
            href="https://forms.gle/hk3wCVvmyRxqbxv59"
            target="_blank"
          >
            Feedback
          </PrimaryButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
