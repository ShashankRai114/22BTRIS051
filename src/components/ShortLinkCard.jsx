import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ShortLinkCard({
  data = {},
  baseUrl = "http://localhost:3000",
  onOpenStats = () => {},
}) {
  const safe = {
    shortcode: "",
    longUrl: "",
    createdAt: new Date().toISOString(),
    expiresAt: new Date().toISOString(),
    clicks: [],
    ...data,
  };
  const shortUrl = `${baseUrl}/${safe.shortcode}`;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ wordBreak: "break-all" }}>
          Original: {safe.longUrl}
        </Typography>
        <Typography variant="body2">
          Short: <a href={shortUrl}>{shortUrl}</a>
        </Typography>
        <Typography variant="body2">
          Created: {new Date(safe.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Expires: {new Date(safe.expiresAt).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Clicks: {Array.isArray(safe.clicks) ? safe.clicks.length : 0}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => window.open(shortUrl, "_blank")}
          >
            Open
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onOpenStats(safe.shortcode)}
          >
            Stats
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
