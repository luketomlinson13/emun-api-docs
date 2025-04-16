import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface CustomAccordionProps {
  title: string;
  expandAll: boolean; // controlled by parent
  children: React.ReactNode;
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  expandAll,
  children,
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
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
