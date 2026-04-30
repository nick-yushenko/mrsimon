import "@mui/material/Card";
import "@mui/material/Paper";

declare module "@mui/material/Card" {
  interface CardPropsVariantOverrides {
    plain: true;
    panel: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    plain: true;
    panel: true;
  }
}
