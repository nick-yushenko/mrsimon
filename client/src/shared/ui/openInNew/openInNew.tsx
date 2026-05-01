import { Link, type LinkProps } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

type TProps = LinkProps & {
  showIcon?: boolean;
};

export const OpenInNewLink = ({ children, showIcon = true, sx, ...props }: TProps) => {
  return (
    <Link
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      sx={[
        {
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          gap: 0.5,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
      {showIcon && <OpenInNewIcon sx={{ fontSize: 14 }} />}
    </Link>
  );
};
