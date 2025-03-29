"use client";

import React, { useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography } from "@mui/material";

// Ensure PDF.js worker is properly loaded
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFAnnotator = ({ file }: {file: any}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Placeholder for annotation logic
    console.log("PDF Loaded: ", file);
  }, [file]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">PDF Viewer</Typography>
      <Document file={file} onLoadSuccess={() => console.log("PDF Loaded")}>
        <Page pageNumber={1} canvasRef={canvasRef} />
      </Document>
    </Box>
  );
};

export default PDFAnnotator;
