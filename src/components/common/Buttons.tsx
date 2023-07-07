import { Button, ButtonProps } from "@mui/material";

function PrimaryButton({ ...props }: ButtonProps) {
  return (
    <Button
      className="bg-primary-button px-8 py-3 font-medium"
      variant="contained"
      sx={{ textTransform: "none" }}
      {...props}
    />
  );
}

function SecondaryButton({ ...props }: ButtonProps) {
  return (
    <Button
      className="bg-secondary-button px-8 py-3 font-normal"
      variant="contained"
      color="inherit"
      sx={{ textTransform: "none" }}
      {...props}
    />
  );
}

export { PrimaryButton, SecondaryButton };
