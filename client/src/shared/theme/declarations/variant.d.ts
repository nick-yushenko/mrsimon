import "@mui/material/Card";
import "@mui/material/Paper";
import "@mui/material/Divider";

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

declare module "@mui/material/Divider" {
  interface DividerPropsVariantOverrides {
    dashed: true;
    "middle-dashed": true;
  }
}
