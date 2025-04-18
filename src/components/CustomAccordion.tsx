import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface CustomAccordionProps {
  title: string;
  expandAll: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  expandAll,
  children,
  icon,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Update state when expandAll changes
    setExpanded(expandAll);
  }, [expandAll]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Accordion expanded={expanded} onChange={toggleExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          {icon && (
            <Box
              sx={{
                mr: 1,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
              }}
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { fontSize: 14 },
              })}
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
          >
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
