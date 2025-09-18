import React, { useState } from "react";
import { Container, Typography, Box, Grid, Button, Alert } from "@mui/material";
import { saveAll, loadAll, generateShortcode } from "../utils/storage";
import LoggingMiddleware from "../utils/LoggingMiddleware";
import ShortenFormRow from "../components/ShortenFormRow";
import ShortLinkCard from "../components/ShortLinkCard";

const BASE_URL = "http://localhost:3000";
const SHORTCODE_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

export default function URLShortenerPage({ navigateToStats }) {
  const [rows, setRows] = useState([
    { longUrl: "", validityMinutes: "", customShortcode: "" },
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const onChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    if (rows.length < 5) {
      setRows([
        ...rows,
        { longUrl: "", validityMinutes: "", customShortcode: "" },
      ]);
    }
  };

  const submit = () => {
    setError(null);
    const store = loadAll();
    const existing = store.links || {};

    const created = [];

    for (const r of rows) {
      const { longUrl, validityMinutes, customShortcode } = r;

      if (!longUrl) {
        setError("URL cannot be empty.");
        return;
      }

      try {
        new URL(longUrl);
      } catch (e) {
        setError(`Invalid URL format: ${longUrl}`);
        LoggingMiddleware.log("validation_error", {
          reason: "invalid_url_format",
          longUrl,
        });
        return;
      }

      if (validityMinutes && (isNaN(validityMinutes) || validityMinutes < 1)) {
        setError(
          `Invalid validity minutes: ${validityMinutes}. Must be a positive integer.`
        );
        LoggingMiddleware.log("validation_error", {
          reason: "invalid_validity",
          validityMinutes,
        });
        return;
      }

      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + (parseInt(validityMinutes, 10) || 30) * 60000
      ).toISOString();

      let shortcode = customShortcode;

      if (shortcode) {
        if (!SHORTCODE_REGEX.test(shortcode)) {
          setError(
            `Invalid shortcode: ${shortcode}. Only alphanumeric, '-', '_' allowed (3-20 chars).`
          );
          LoggingMiddleware.log("validation_error", {
            reason: "invalid_shortcode_format",
            shortcode,
          });
          return;
        }
        if (existing[shortcode]) {
          setError(`Shortcode collision: ${shortcode}`);
          LoggingMiddleware.log("validation_error", {
            reason: "shortcode_collision",
            shortcode,
          });
          return;
        }
      } else {
        shortcode = generateShortcode();
        let attempts = 0;
        while (existing[shortcode] && attempts < 10) {
          shortcode = generateShortcode();
          attempts += 1;
        }
        if (existing[shortcode]) {
          setError("Failed to generate a unique shortcode. Please try again.");
          LoggingMiddleware.log("generation_error", {
            reason: "unique_shortcode_failed",
          });
          return;
        }
      }

      const record = {
        shortcode,
        longUrl,
        createdAt: now.toISOString(),
        expiresAt,
        clicks: [],
      };
      existing[shortcode] = record;
      created.push(record);
      LoggingMiddleware.log("create_shortlink", {
        shortcode,
        longUrl,
        expiresAt,
      });
    }

    store.links = existing;
    saveAll(store);
    setResults(created);
  };

  const openStats = (shortcode) => {
    try {
      if (navigateToStats) {
        navigateToStats(shortcode);
      }
    } catch (e) {
      // no-op if navigation not available
    }
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          Shorten up to 5 URLs together. Default validity is 30 minutes if left
          blank.
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {rows.map((r, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <ShortenFormRow index={i} value={r} onChange={onChange} />
            </Box>
          ))}
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              onClick={addRow}
              disabled={rows.length >= 5}
              variant="outlined"
            >
              Add Row
            </Button>
            <Button onClick={submit} variant="contained">
              Shorten
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Recent Results</Typography>
          {results.length === 0 && (
            <Typography variant="body2">No results yet.</Typography>
          )}
          {results.map((r) => (
            <ShortLinkCard
              key={r.shortcode}
              data={r}
              baseUrl={BASE_URL}
              onOpenStats={openStats}
            />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
