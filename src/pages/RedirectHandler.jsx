import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import { loadAll, saveAll } from "../utils/storage";
import LoggingMiddleware from "../utils/LoggingMiddleware";

export default function RedirectPage() {
  const { shortcode } = useParams(); // get shortcode from route param
  const navigate = useNavigate();

  useEffect(() => {
    const store = loadAll();
    const links = store.links || {};
    const link = links[shortcode];
    const now = new Date();

    if (!link) {
      LoggingMiddleware.log("redirect_miss", { shortcode });
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    if (new Date(link.expiresAt) < now) {
      LoggingMiddleware.log("redirect_expired", { shortcode });
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    // record click
    const click = {
      ts: now.toISOString(),
      source: document?.referrer || "direct",
    };

    const addClickAndRedirect = (geo) => {
      try {
        click.geo = geo || "unknown";
        if (!Array.isArray(link.clicks)) link.clicks = [];
        link.clicks.push(click);
        links[shortcode] = link;
        store.links = links;
        saveAll(store);

        LoggingMiddleware.log("redirect_hit", { shortcode, click });

        // Redirect in the same tab
        window.location.href = link.longUrl;
      } catch (e) {
        navigate("/");
      }
    };

    // geolocation attempt
    if (navigator && navigator.geolocation) {
      const geoTimeout = setTimeout(() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        addClickAndRedirect(tz || "unknown");
      }, 2000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(geoTimeout);
          const coarse = `${Math.round(pos.coords.latitude)},${Math.round(
            pos.coords.longitude
          )}`;
          addClickAndRedirect(coarse);
        },
        () => {
          clearTimeout(geoTimeout);
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          addClickAndRedirect(tz || "unknown");
        },
        { timeout: 1500 }
      );
    } else {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      addClickAndRedirect(tz || "unknown");
    }
  }, [shortcode, navigate]);

  return (
    <Container sx={{ py: 4, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Redirecting...</Typography>
      </Box>
    </Container>
  );
}
