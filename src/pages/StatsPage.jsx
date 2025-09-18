import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { loadAll } from "../utils/storage";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import LoggingMiddleware from "../logging/LoggingMiddleware";

export default function StatsPage({ searchShortcode = "" }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const store = loadAll();
    setData(store.links || {});
  }, []);

  const allLinks = data ? Object.values(data) : [];

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Short URL Statistics
      </Typography>
      {allLinks.length === 0 && (
        <Typography>No short links created yet.</Typography>
      )}
      {allLinks.map((link) => (
        <Card sx={{ mb: 2 }} key={link.shortcode || Math.random()}>
          <CardContent>
            <Typography variant="h6">{`/${link.shortcode}`}</Typography>
            <Typography>Original: {link.longUrl}</Typography>
            <Typography>
              Created: {new Date(link.createdAt).toLocaleString()}
            </Typography>
            <Typography>
              Expires: {new Date(link.expiresAt).toLocaleString()}
            </Typography>
            <Typography>
              Clicks: {Array.isArray(link.clicks) ? link.clicks.length : 0}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <List dense>
                {Array.isArray(link.clicks) &&
                  link.clicks.map((c, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`${new Date(c.ts).toLocaleString()} — source:${
                          c.source || "direct"
                        } — geo:${c.geo || "unknown"}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
