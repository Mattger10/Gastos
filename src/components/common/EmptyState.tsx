import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { Box, Typography } from "@mui/material";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      <InboxOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
      <Typography fontWeight={700}>{title}</Typography>
      {description ? <Typography variant="body2">{description}</Typography> : null}
    </Box>
  );
}
