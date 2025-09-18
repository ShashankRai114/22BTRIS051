import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

// Defensive defaults to avoid invalid value access
export default function ShortenFormRow({
  index = 0,
  value = { url: "", validity: "", shortcode: "" },
  onChange = () => {},
}) {
  const safeValue = { url: "", validity: "", shortcode: "", ...value };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Long URL ${index + 1}`}
          value={safeValue.url}
          onChange={(e) =>
            onChange(index, { ...safeValue, url: e.target.value })
          }
          required
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          label="Validity (minutes)"
          type="number"
          inputProps={{ min: 1 }}
          value={safeValue.validity}
          onChange={(e) =>
            onChange(index, { ...safeValue, validity: e.target.value })
          }
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          label="Preferred shortcode (optional)"
          value={safeValue.shortcode}
          onChange={(e) =>
            onChange(index, { ...safeValue, shortcode: e.target.value })
          }
        />
      </Grid>
    </Grid>
  );
}
