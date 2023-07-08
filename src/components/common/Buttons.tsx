import { Button, ButtonProps } from "@mui/material";

function PrimaryButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={`bg-primary-button px-8 py-3 font-medium ${className}`}
      variant="contained"
      sx={{ textTransform: "none" }}
      {...props}
    />
  );
}

function SecondaryButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={`bg-secondary-button px-8 py-3 font-normal ${className}`}
      variant="contained"
      color="inherit"
      sx={{ textTransform: "none" }}
      {...props}
    />
  );
}

export { PrimaryButton, SecondaryButton };
